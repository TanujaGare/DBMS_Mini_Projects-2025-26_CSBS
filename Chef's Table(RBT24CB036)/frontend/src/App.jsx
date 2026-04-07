import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { apiFetch } from './api';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AuthOverlay from './pages/AuthOverlay';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  orders: 'Active Orders',
  kitchen: 'Kitchen Display',
  tables: 'Floor Plan',
  reservations: 'Reservations',
  menu: 'Menu',
  inventory: 'Inventory',
  staff: 'Staff',
};

const INITIAL_TABLES = [
  { id: 1, cap: 2, status: 'vacant' }, { id: 2, cap: 2, status: 'occupied' }, { id: 3, cap: 4, status: 'occupied' },
  { id: 4, cap: 4, status: 'reserved' }, { id: 5, cap: 4, status: 'occupied' }, { id: 6, cap: 6, status: 'vacant' },
  { id: 7, cap: 4, status: 'occupied' }, { id: 8, cap: 2, status: 'dirty' }, { id: 9, cap: 6, status: 'vacant' },
  { id: 10, cap: 4, status: 'vacant' }, { id: 11, cap: 4, status: 'occupied' }, { id: 12, cap: 8, status: 'reserved' },
  { id: 13, cap: 2, status: 'vacant' }, { id: 14, cap: 4, status: 'occupied' }, { id: 15, cap: 4, status: 'dirty' },
  { id: 16, cap: 6, status: 'vacant' }, { id: 17, cap: 2, status: 'reserved' }, { id: 18, cap: 8, status: 'occupied' },
];

function AppContent() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activePage, setActivePage] = useState(isAdmin ? 'dashboard' : 'orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState({});
  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tables, setTables] = useState(INITIAL_TABLES);

  const loadOrders = useCallback(async () => {
    try {
      const { orders: raw } = await apiFetch('/orders');
      setOrders(raw.map((o, idx) => ({
        _id: o._id,
        id: '#' + String(idx + 1).padStart(3, '0'),
        table: o.table,
        waiter: o.waiter,
        items: o.items,
        total: o.total,
        status: o.status,
        time: o.time,
        notes: o.notes,
      })));
    } catch (err) { console.warn('loadOrders failed:', err.message); }
  }, []);

  const loadReservations = useCallback(async () => {
    try {
      const { reservations: raw } = await apiFetch('/reservations');
      setReservations(raw);
    } catch (err) { console.warn('loadReservations failed:', err.message); }
  }, []);

  const loadMenu = useCallback(async () => {
    try {
      const { items } = await apiFetch('/menu');
      const grouped = {};
      items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });
      setMenu(grouped);
    } catch (err) { console.warn('loadMenu failed:', err.message); }
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      const { items } = await apiFetch('/inventory');
      setInventory(items);
    } catch (err) { console.warn('loadInventory failed:', err.message); }
  }, []);

  const loadStaff = useCallback(async () => {
    try {
      const { staff: raw } = await apiFetch('/staff');
      setStaff(raw);
    } catch (err) { console.warn('loadStaff failed:', err.message); }
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([loadOrders(), loadReservations(), loadMenu(), loadInventory(), loadStaff()]);
    if (user.role === 'chef') {
      setActivePage('orders');
    } else {
      setActivePage('dashboard');
    }
  }, [user, loadOrders, loadReservations, loadMenu, loadInventory, loadStaff]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--gold-light)', fontFamily: "'Cormorant Garamond', serif", fontSize: 24 }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return <AuthOverlay />;
  }

  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard orders={orders} reservations={reservations} inventory={inventory} tables={tables} />;
      case 'orders':
        return <Orders orders={orders} setOrders={setOrders} loadOrders={loadOrders} tables={tables} staff={staff} />;
      case 'kitchen':
        return <Kitchen orders={orders} />;
      case 'tables':
        return <Tables tables={tables} setTables={setTables} />;
      case 'reservations':
        return <Reservations reservations={reservations} setReservations={setReservations} loadReservations={loadReservations} />;
      case 'menu':
        return <Menu menu={menu} loadMenu={loadMenu} />;
      case 'inventory':
        return <Inventory inventory={inventory} loadInventory={loadInventory} />;
      case 'staff':
        return <Staff staff={staff} loadStaff={loadStaff} />;
      default:
        return <Dashboard orders={orders} reservations={reservations} inventory={inventory} tables={tables} />;
    }
  }

  return (
    <>
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="main">
        <Topbar pageTitle={PAGE_TITLES[activePage] || activePage} />
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

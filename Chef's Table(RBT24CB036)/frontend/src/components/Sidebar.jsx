import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { section: 'Operations', items: [
    { id: 'dashboard', icon: '▦', label: 'Dashboard', adminOnly: true },
    { id: 'orders', icon: '🧾', label: 'Orders' },
    { id: 'kitchen', icon: '👨‍🍳', label: 'Kitchen' },
    { id: 'tables', icon: '◫', label: 'Tables', adminOnly: true },
  ]},
  { section: 'Restaurant', items: [
    { id: 'reservations', icon: '📅', label: 'Reservations', adminOnly: true },
    { id: 'menu', icon: '📖', label: 'Menu', adminOnly: true },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
  ]},
  { section: 'Team', adminOnly: true, items: [
    { id: 'staff', icon: '👥', label: 'Staff', adminOnly: true },
  ]},
];

export default function Sidebar({ activePage, onPageChange }) {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Chef's Table</h1>
        <span>Management System</span>
      </div>
      <nav>
        {NAV_ITEMS.map(section => {
          if (section.adminOnly && !isAdmin) return null;
          const visibleItems = section.items.filter(item => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;
          return (
            <div className="nav-section" key={section.section}>
              <div className="nav-label">{section.section}</div>
              {visibleItems.map(item => (
                <div
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => onPageChange(item.id)}
                >
                  <span className="icon">{item.icon}</span> {item.label}
                </div>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <strong>Saturday Dinner</strong>
        Shift: 5:00 PM — 11:30 PM
      </div>
    </aside>
  );
}

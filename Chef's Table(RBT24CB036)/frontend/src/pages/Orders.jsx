import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../api';
import { StatusBadge } from '../utils';
import Modal from '../components/Modal';

export default function Orders({ orders, setOrders, loadOrders, tables, staff, onRefreshKitchen }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [oTable, setOTable] = useState('');
  const [oWaiter, setOWaiter] = useState('');
  const [oItems, setOItems] = useState('');
  const [oTotal, setOTotal] = useState('');
  const [oNotes, setONotes] = useState('');

  async function updateOrderStatus(i, status) {
    const order = orders[i];
    try {
      await apiFetch('/orders/' + order._id, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      await loadOrders();
      toast(`Order ${order.id} marked as ${status}`);
    } catch (err) {
      toast('Status update failed: ' + err.message);
    }
  }

  async function deleteOrder(i) {
    const order = orders[i];
    try {
      await apiFetch('/orders/' + order._id, { method: 'DELETE' });
      await loadOrders();
      toast('Order cancelled');
    } catch (err) {
      toast('Delete failed: ' + err.message);
    }
  }

  async function submitOrder() {
    const table = Number(oTable);
    const items = oItems.split(',').map(s => s.trim()).filter(Boolean);
    const total = parseFloat(oTotal) || 0;
    if (!items.length || !total) { toast('Please fill all fields'); return; }

    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({ table, waiter: oWaiter, items, total, notes: oNotes, status: 'new' })
      });
      setModalOpen(false);
      await loadOrders();
      toast('Order saved to backend');
      setOItems(''); setOTotal(''); setONotes('');
    } catch (err) {
      toast('Order submit failed: ' + err.message);
    }
  }

  const availableTables = tables.filter(t => t.status === 'vacant' || t.status === 'occupied');
  const availableWaiters = staff.filter(s => s.role === 'Waiter' && s.status === 'on-shift');

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Active <span>Orders</span></div>
        {isAdmin && (
          <button className="btn btn-gold" onClick={() => setModalOpen(true)}>+ New Order</button>
        )}
      </div>

      {orders.map((o, i) => (
        <div className="order-card" key={i}>
          <div className="order-header">
            <div>
              <div className="order-id">{o.id} · Table {o.table}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Waiter: {o.waiter} · {o.time}</div>
            </div>
            <StatusBadge status={o.status} />
          </div>
          <div className="order-items">
            {o.items.map((it, j) => <span key={j}>• {it}<br /></span>)}
          </div>
          {o.notes && (
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' }}>📝 {o.notes}</div>
          )}
          <div className="order-footer">
            <div className="order-total">₹{o.total}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {o.status === 'new' && <button className="btn btn-sm btn-gold" onClick={() => updateOrderStatus(i, 'cooking')}>Start Cooking</button>}
              {o.status === 'cooking' && <button className="btn btn-sm btn-gold" onClick={() => updateOrderStatus(i, 'ready')}>Mark Ready</button>}
              {o.status === 'ready' && <button className="btn btn-sm btn-success" onClick={() => updateOrderStatus(i, 'served')}>Served ✓</button>}
              {o.status !== 'served' && isAdmin && <button className="btn btn-sm btn-outline" onClick={() => deleteOrder(i)}>Cancel</button>}
            </div>
          </div>
        </div>
      ))}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <div className="form-row">
          <div className="form-group">
            <label>Table Number</label>
            <select value={oTable} onChange={e => setOTable(e.target.value)}>
              <option value="">Select table</option>
              {availableTables.map(t => <option key={t.id} value={t.id}>Table {t.id} ({t.cap} pax)</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Waiter</label>
            <select value={oWaiter} onChange={e => setOWaiter(e.target.value)}>
              <option value="">Select waiter</option>
              {availableWaiters.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Items (comma separated)</label>
          <textarea placeholder="e.g. Butter Chicken, Naan, Lassi" value={oItems} onChange={e => setOItems(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group"><label>Special Instructions</label><input placeholder="Allergies, preferences…" value={oNotes} onChange={e => setONotes(e.target.value)} /></div>
          <div className="form-group"><label>Total (₹)</label><input type="number" placeholder="0" value={oTotal} onChange={e => setOTotal(e.target.value)} /></div>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitOrder}>Place Order</button>
        </div>
      </Modal>
    </div>
  );
}

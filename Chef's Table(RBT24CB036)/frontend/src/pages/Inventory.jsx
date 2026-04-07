import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../api';
import Modal from '../components/Modal';

export default function Inventory({ inventory, loadInventory }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  
  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [iName, setIName] = useState('');
  const [iCat, setICat] = useState('Grains');
  const [iQty, setIQty] = useState('');
  const [iUnit, setIUnit] = useState('kg');
  const [iMin, setIMin] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [eQty, setEQty] = useState('');

  // Submit Add
  async function submitInventory() {
    const name = iName.trim();
    const qty = parseFloat(iQty) || 0;
    const min = parseFloat(iMin) || 0;
    if (!name) { toast('Please enter item name'); return; }
    try {
      await apiFetch('/inventory', { method: 'POST', body: JSON.stringify({ name, cat: iCat, qty, unit: iUnit, min }) });
      setAddModalOpen(false);
      await loadInventory();
      toast(name + ' added to inventory');
      setIName(''); setIQty(''); setIMin('');
    } catch (err) { toast('Failed: ' + err.message); }
  }

  // Open Edit
  function openEditModal(item) {
    setEditingItem(item);
    setEQty(item.qty);
    setEditModalOpen(true);
  }

  // Submit Edit
  async function submitEditInventory() {
    const qty = parseFloat(eQty);
    if (isNaN(qty)) { toast('Please enter a valid quantity'); return; }
    try {
      await apiFetch('/inventory/' + editingItem._id, { 
        method: 'PUT', 
        body: JSON.stringify({ qty }) 
      });
      setEditModalOpen(false);
      await loadInventory();
      toast(editingItem.name + ' quantity updated');
      setEditingItem(null);
    } catch (err) { toast('Failed: ' + err.message); }
  }

  // Delete Item
  async function deleteInventory(item) {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await apiFetch('/inventory/' + item._id, { method: 'DELETE' });
      await loadInventory();
      toast(item.name + ' deleted');
    } catch (err) { toast('Failed: ' + err.message); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Inventory <span>Management</span></div>
        {isAdmin && (
          <button className="btn btn-gold" onClick={() => setAddModalOpen(true)}>+ Add Item</button>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Unit</th>
              <th>Min Level</th>
              <th>Status</th>
              <th>Stock Level</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => {
              const pct = Math.min(100, Math.round(item.qty / item.min * 50));
              const low = item.qty <= item.min;
              const color = low ? 'var(--danger)' : item.qty < item.min * 1.5 ? 'var(--gold)' : 'var(--success)';
              return (
                <tr key={item._id || i}>
                  <td>{item.name}</td>
                  <td><span className="badge badge-muted">{item.cat}</span></td>
                  <td className="text-gold" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>{item.qty}</td>
                  <td style={{ color: 'var(--muted)' }}>{item.unit}</td>
                  <td style={{ color: 'var(--muted)' }}>{item.min} {item.unit}</td>
                  <td>{low ? <span className="badge badge-red">Low Stock</span> : <span className="badge badge-green">OK</span>}</td>
                  <td style={{ width: 120 }}>
                    <div className="inv-bar"><div className="inv-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }}></div></div>
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ marginRight: '8px' }} onClick={() => openEditModal(item)}>Edit Qty</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteInventory(item)}>✕</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Inventory Item">
        <div className="form-row">
          <div className="form-group"><label>Item Name</label><input placeholder="e.g. Basmati Rice" value={iName} onChange={e => setIName(e.target.value)} /></div>
          <div className="form-group">
            <label>Category</label>
            <select value={iCat} onChange={e => setICat(e.target.value)}>
              <option>Grains</option><option>Proteins</option><option>Vegetables</option><option>Dairy</option><option>Spices</option><option>Beverages</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Quantity</label><input type="number" placeholder="0" value={iQty} onChange={e => setIQty(e.target.value)} /></div>
          <div className="form-group">
            <label>Unit</label>
            <select value={iUnit} onChange={e => setIUnit(e.target.value)}>
              <option>kg</option><option>g</option><option>L</option><option>ml</option><option>pcs</option><option>dozen</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Min Level</label><input type="number" placeholder="0" value={iMin} onChange={e => setIMin(e.target.value)} /></div>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setAddModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitInventory}>Add Item</button>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Update ${editingItem?.name} Quantity`}>
        <div className="form-row">
          <div className="form-group full">
            <label>New Quantity ({editingItem?.unit})</label>
            <input type="number" step="0.1" value={eQty} onChange={e => setEQty(e.target.value)} />
          </div>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setEditModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitEditInventory}>Update Quantity</button>
        </div>
      </Modal>
    </div>
  );
}

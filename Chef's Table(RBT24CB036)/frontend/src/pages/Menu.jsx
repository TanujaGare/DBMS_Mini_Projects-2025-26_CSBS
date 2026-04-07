import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../api';
import Modal from '../components/Modal';

export default function Menu({ menu, loadMenu }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [mName, setMName] = useState('');
  const [mCat, setMCat] = useState('Starters');
  const [mPrice, setMPrice] = useState('');
  const [mEmoji, setMEmoji] = useState('');
  const [mDesc, setMDesc] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [eName, setEName] = useState('');
  const [eCat, setECat] = useState('Starters');
  const [ePrice, setEPrice] = useState('');
  const [eEmoji, setEEmoji] = useState('');
  const [eDesc, setEDesc] = useState('');

  async function removeMenuItem(id) {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiFetch('/menu/' + id, { method: 'DELETE' });
      await loadMenu();
      toast('Menu item removed');
    } catch (err) { toast('Delete failed: ' + err.message); }
  }

  async function submitMenuItem() {
    const name = mName.trim();
    const price = parseInt(mPrice) || 0;
    const emoji = mEmoji || '🍽️';
    const desc = mDesc.trim();
    if (!name || !price) { toast('Please fill required fields'); return; }
    try {
      await apiFetch('/menu', { method: 'POST', body: JSON.stringify({ name, category: mCat, price, emoji, desc }) });
      setModalOpen(false);
      await loadMenu();
      toast(name + ' added to ' + mCat);
      setMName(''); setMPrice(''); setMDesc(''); setMEmoji('');
    } catch (err) { toast('Failed: ' + err.message); }
  }

  function openEditModal(item) {
    setEditingItem(item);
    setEName(item.name);
    setECat(item.category);
    setEPrice(item.price);
    setEEmoji(item.emoji || '🍽️');
    setEDesc(item.desc || '');
    setEditModalOpen(true);
  }

  async function submitEditMenuItem() {
    const name = eName.trim();
    const price = parseInt(ePrice) || 0;
    const emoji = eEmoji || '🍽️';
    const desc = eDesc.trim();
    if (!name || !price) { toast('Please fill required fields'); return; }
    try {
      await apiFetch('/menu/' + editingItem._id, {
        method: 'PUT',
        body: JSON.stringify({ name, category: eCat, price, emoji, desc })
      });
      setEditModalOpen(false);
      await loadMenu();
      toast(name + ' updated');
      setEditingItem(null);
    } catch (err) { toast('Update failed: ' + err.message); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Menu <span>Items</span></div>
        {isAdmin && (
          <button className="btn btn-gold" onClick={() => setModalOpen(true)}>+ Add Item</button>
        )}
      </div>

      {Object.entries(menu).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ fontSize: 18 }}>{cat}</div>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{items.length} items</span>
          </div>
          <div className="menu-grid">
            {items.map((item) => (
              <div className="menu-card" key={item._id || item.name}>
                <div className="menu-img">{item.emoji}</div>
                <div className="menu-body">
                  <div className="menu-name">{item.name}</div>
                  <div className="menu-desc">{item.desc}</div>
                  <div className="menu-footer">
                    <div className="menu-price">₹{item.price}</div>
                    <div className="menu-actions">
                      {isAdmin && (
                        <>
                          <button className="btn btn-sm btn-outline" style={{ marginRight: '6px' }} onClick={() => openEditModal(item)}>✎</button>
                          <button className="btn btn-sm btn-outline" onClick={() => removeMenuItem(item._id)}>✕</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ADD MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Menu Item">
        <div className="form-row">
          <div className="form-group"><label>Name</label><input placeholder="Dish name" value={mName} onChange={e => setMName(e.target.value)} /></div>
          <div className="form-group">
            <label>Category</label>
            <select value={mCat} onChange={e => setMCat(e.target.value)}>
              <option>Starters</option><option>Mains</option><option>Breads</option><option>Desserts</option><option>Beverages</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Price (₹)</label><input type="number" placeholder="0" value={mPrice} onChange={e => setMPrice(e.target.value)} /></div>
          <div className="form-group"><label>Emoji</label><input placeholder="🍛" maxLength="2" value={mEmoji} onChange={e => setMEmoji(e.target.value)} /></div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}><label>Description</label><textarea placeholder="Brief description…" value={mDesc} onChange={e => setMDesc(e.target.value)} /></div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitMenuItem}>Add to Menu</button>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit ${editingItem?.name || 'Menu Item'}`}>
        <div className="form-row">
          <div className="form-group"><label>Name</label><input placeholder="Dish name" value={eName} onChange={e => setEName(e.target.value)} /></div>
          <div className="form-group">
            <label>Category</label>
            <select value={eCat} onChange={e => setECat(e.target.value)}>
              <option>Starters</option><option>Mains</option><option>Breads</option><option>Desserts</option><option>Beverages</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Price (₹)</label><input type="number" placeholder="0" value={ePrice} onChange={e => setEPrice(e.target.value)} /></div>
          <div className="form-group"><label>Emoji</label><input placeholder="🍛" maxLength="2" value={eEmoji} onChange={e => setEEmoji(e.target.value)} /></div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}><label>Description</label><textarea placeholder="Brief description…" value={eDesc} onChange={e => setEDesc(e.target.value)} /></div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setEditModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitEditMenuItem}>Update Item</button>
        </div>
      </Modal>
    </div>
  );
}

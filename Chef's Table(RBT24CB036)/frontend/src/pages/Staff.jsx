import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../api';
import Modal from '../components/Modal';

export default function Staff({ staff, loadStaff }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [stName, setStName] = useState('');
  const [stRole, setStRole] = useState('Head Chef');
  const [stShift, setStShift] = useState('Morning');
  const [stPhone, setStPhone] = useState('');

  async function toggleStaffStatus(id, i) {
    const newStatus = staff[i].status === 'on-shift' ? 'break' : 'on-shift';
    try {
      await apiFetch('/staff/' + id, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      await loadStaff();
      toast(`${staff[i].name} status updated`);
    } catch (err) { toast('Update failed: ' + err.message); }
  }

  async function submitStaff() {
    const name = stName.trim();
    if (!name) { toast('Please enter staff name'); return; }
    const emojis = { 'Head Chef': '👨‍🍳', 'Sous Chef': '👩‍🍳', 'Waiter': '🧑', 'Bartender': '🧑', 'Host': '👩', 'Manager': '👔', 'Chef de Partie': '👨‍🍳' };
    try {
      await apiFetch('/staff', { method: 'POST', body: JSON.stringify({ name, role: stRole, shift: stShift, phone: stPhone, emoji: emojis[stRole] || '🧑', status: 'on-shift' }) });
      setModalOpen(false);
      await loadStaff();
      toast(name + ' added to team');
      setStName(''); setStPhone('');
    } catch (err) { toast('Failed: ' + err.message); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Staff <span>On Shift</span></div>
        {isAdmin && (
          <button className="btn btn-gold" onClick={() => setModalOpen(true)}>+ Add Staff</button>
        )}
      </div>
      <div className="staff-grid">
        {staff.map((s, i) => (
          <div className="staff-card" key={s._id || i}>
            <div className="staff-avatar">{s.emoji}</div>
            <div className="staff-name">{s.name}</div>
            <div className="staff-role">{s.role}</div>
            <span className={`badge ${s.status === 'on-shift' ? 'badge-green' : 'badge-gold'}`}>
              {s.status === 'on-shift' ? 'On Shift' : 'On Break'}
            </span>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--muted)' }}>{s.shift} Shift</div>
            <button
              className="btn btn-sm btn-outline"
              style={{ marginTop: 10, width: '100%' }}
              onClick={() => toggleStaffStatus(s._id, i)}
            >
              {s.status === 'on-shift' ? 'Mark Break' : 'Back on Shift'}
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <div className="form-row">
          <div className="form-group"><label>Name</label><input placeholder="Full name" value={stName} onChange={e => setStName(e.target.value)} /></div>
          <div className="form-group">
            <label>Role</label>
            <select value={stRole} onChange={e => setStRole(e.target.value)}>
              <option>Head Chef</option><option>Sous Chef</option><option>Chef de Partie</option><option>Waiter</option><option>Bartender</option><option>Host</option><option>Manager</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Shift</label>
            <select value={stShift} onChange={e => setStShift(e.target.value)}>
              <option>Morning</option><option>Evening</option><option>Night</option><option>Full Day</option>
            </select>
          </div>
          <div className="form-group"><label>Contact</label><input placeholder="+91" value={stPhone} onChange={e => setStPhone(e.target.value)} /></div>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitStaff}>Add Staff</button>
        </div>
      </Modal>
    </div>
  );
}

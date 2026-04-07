import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../api';
import { StatusBadge } from '../utils';
import Modal from '../components/Modal';

export default function Reservations({ reservations, setReservations, loadReservations }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [rName, setRName] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rDate, setRDate] = useState(new Date().toISOString().split('T')[0]);
  const [rTime, setRTime] = useState('');
  const [rGuests, setRGuests] = useState('');
  const [rTable, setRTable] = useState('Any');
  const [rNotes, setRNotes] = useState('');

  async function deleteRes(id) {
    try {
      await apiFetch('/reservations/' + id, { method: 'DELETE' });
      setReservations(prev => prev.filter(r => r._id !== id));
      toast('Reservation cancelled');
    } catch (err) { toast('Delete failed: ' + err.message); }
  }

  async function submitReservation() {
    if (!rName || !rTime || !rGuests) { toast('Please fill required fields'); return; }
    const [h, m] = rTime.split(':');
    const hr = parseInt(h);
    const period = hr >= 12 ? 'PM' : 'AM';
    const disp = `${hr > 12 ? hr - 12 : hr}:${m} ${period}`;
    try {
      await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ name: rName, phone: rPhone, date: 'Today', time: disp, guests: parseInt(rGuests), pref: rTable, notes: rNotes, status: 'confirmed' })
      });
      setModalOpen(false);
      await loadReservations();
      toast('Reservation confirmed for ' + rName);
      setRName(''); setRPhone(''); setRTime(''); setRGuests(''); setRNotes('');
    } catch (err) { toast('Failed: ' + err.message); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Today's <span>Reservations</span></div>
        {isAdmin && (
          <button className="btn btn-gold" onClick={() => setModalOpen(true)}>+ New Reservation</button>
        )}
      </div>
      <div className="res-list">
        {reservations.map((r, i) => (
          <div className="res-item" key={r._id || i}>
            <div className="res-time">{r.time}<small>{r.date}</small></div>
            <div className="res-info">
              <div className="res-name">{r.name}</div>
              <div className="res-details">📞 {r.phone} · {r.guests} guests · {r.pref}{r.notes ? ' · ' + r.notes : ''}</div>
            </div>
            <div className="res-actions">
              <StatusBadge status={r.status === 'confirmed' ? 'ready' : 'new'} />
              <button className="btn btn-sm btn-danger" onClick={() => deleteRes(r._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Reservation">
        <div className="form-row">
          <div className="form-group"><label>Guest Name</label><input placeholder="Full name" value={rName} onChange={e => setRName(e.target.value)} /></div>
          <div className="form-group"><label>Phone</label><input placeholder="+91 98765 43210" value={rPhone} onChange={e => setRPhone(e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Date</label><input type="date" value={rDate} onChange={e => setRDate(e.target.value)} /></div>
          <div className="form-group"><label>Time</label><input type="time" value={rTime} onChange={e => setRTime(e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Guests</label><input type="number" placeholder="2" min="1" max="20" value={rGuests} onChange={e => setRGuests(e.target.value)} /></div>
          <div className="form-group">
            <label>Table Preference</label>
            <select value={rTable} onChange={e => setRTable(e.target.value)}>
              <option>Any</option><option>Window</option><option>Private</option><option>Terrace</option>
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}><label>Special Requests</label><textarea placeholder="Anniversary, high chair, dietary…" value={rNotes} onChange={e => setRNotes(e.target.value)} /></div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={submitReservation}>Confirm Reservation</button>
        </div>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi2';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: '', position: '', description: '', ctc: '', stipend: '',
    jobLocation: '', skillsRequired: '', selectionProcedure: '',
    minCGPA: '', arrivalDate: '', deadline: '', status: 'upcoming'
  });

  const fetchData = async () => {
    const [drivesRes, companiesRes] = await Promise.all([
      api.get('/drives'),
      api.get('/companies')
    ]);
    setDrives(drivesRes.data);
    setCompanies(companiesRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    if (companies.length === 0) {
      alert('Please add a company first!');
      return;
    }
    setEditing(null);
    setForm({
      company: companies[0]?._id || '', position: '', description: '', ctc: '', stipend: '',
      jobLocation: '', skillsRequired: '', selectionProcedure: '',
      minCGPA: '', arrivalDate: '', deadline: '', status: 'upcoming'
    });
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({
      company: d.company?._id || '', position: d.position, description: d.description || '',
      ctc: d.ctc || '', stipend: d.stipend || '', jobLocation: d.jobLocation || '',
      skillsRequired: d.skillsRequired?.join(', ') || '',
      selectionProcedure: d.selectionProcedure || '',
      minCGPA: d.minCGPA || '', arrivalDate: d.arrivalDate ? d.arrivalDate.split('T')[0] : '',
      deadline: d.deadline ? d.deadline.split('T')[0] : '', status: d.status || 'upcoming'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        skillsRequired: form.skillsRequired ? form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : [],
        minCGPA: parseFloat(form.minCGPA) || 0,
      };
      if (editing) {
        await api.put(`/drives/${editing._id}`, data);
      } else {
        await api.post('/drives', data);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving drive');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this drive?')) return;
    try {
      await api.delete(`/drives/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Placement Drives</h1>
          <p>Manage all placement drives</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> New Drive</button>
      </div>

      {drives.length === 0 ? (
        <div className="neo-card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No drives yet</h3>
            <p>Create your first placement drive.</p>
            <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> New Drive</button>
          </div>
        </div>
      ) : (
        <div className="neo-card-flat">
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>CTC</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map(d => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 600 }}>{d.position}</td>
                    <td>{d.company?.name || 'N/A'}</td>
                    <td>{d.jobLocation || '—'}</td>
                    <td>{d.ctc || '—'}</td>
                    <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                    <td>{d.deadline ? new Date(d.deadline).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="flex gap-sm">
                        <Link to={`/admin/drives/${d._id}/applicants`} className="btn btn-sm btn-accent"><HiOutlineUsers /></Link>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(d)}><HiOutlinePencil /></button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d._id)}><HiOutlineTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Drive' : 'New Placement Drive'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company *</label>
            <select className="form-control" value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })} required>
              {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Position *</label>
            <input type="text" className="form-control" placeholder="Software Engineer"
              value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" placeholder="Job description..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>CTC</label>
              <input type="text" className="form-control" placeholder="12 LPA"
                value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stipend</label>
              <input type="text" className="form-control" placeholder="50k/month"
                value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Job Location</label>
              <input type="text" className="form-control" placeholder="Bangalore"
                value={form.jobLocation} onChange={(e) => setForm({ ...form, jobLocation: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Min CGPA</label>
              <input type="number" className="form-control" step="0.1" min="0" max="10" placeholder="7.0"
                value={form.minCGPA} onChange={(e) => setForm({ ...form, minCGPA: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Skills Required (comma-separated)</label>
            <input type="text" className="form-control" placeholder="React, Node.js, MongoDB"
              value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Selection Procedure</label>
            <textarea className="form-control" placeholder="Online Test → Technical Interview → HR"
              value={form.selectionProcedure} onChange={(e) => setForm({ ...form, selectionProcedure: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Arrival Date</label>
              <input type="date" className="form-control"
                value={form.arrivalDate} onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" className="form-control"
                value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

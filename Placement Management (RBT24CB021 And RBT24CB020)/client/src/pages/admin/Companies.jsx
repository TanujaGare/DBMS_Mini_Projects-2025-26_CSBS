import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', website: '', contactNo: '', logo: '' });
  const [saving, setSaving] = useState(false);

  const fetchCompanies = () => {
    api.get('/companies').then(res => {
      setCompanies(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchCompanies(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', website: '', contactNo: '', logo: '' });
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, website: c.website || '', contactNo: c.contactNo || '', logo: c.logo || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/companies/${editing._id}`, form);
      } else {
        await api.post('/companies', form);
      }
      setModalOpen(false);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving company');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Companies</h1>
          <p>Manage recruiting companies</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus /> Add Company
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="neo-card">
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3>No companies yet</h3>
            <p>Add your first recruiting company to get started.</p>
            <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> Add Company</button>
          </div>
        </div>
      ) : (
        <div className="neo-card-flat">
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Website</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.website ? <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>{c.website}</a> : '—'}</td>
                    <td>{c.contactNo || '—'}</td>
                    <td>
                      <div className="flex gap-sm">
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(c)}><HiOutlinePencil /></button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Company' : 'Add Company'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input type="text" className="form-control" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="url" className="form-control" placeholder="https://company.com"
              value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="text" className="form-control" placeholder="9876543210"
              value={form.contactNo} onChange={(e) => setForm({ ...form, contactNo: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Logo URL</label>
            <input type="url" className="form-control" placeholder="https://..."
              value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
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

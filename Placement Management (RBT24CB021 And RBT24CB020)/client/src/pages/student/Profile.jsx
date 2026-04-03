import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function StudentProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    resumeUrl: user?.resumeUrl || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put(`/students/${user.id}`, {
        ...form,
        cgpa: parseFloat(form.cgpa) || 0,
      });
      setMessage({ type: 'success', text: 'Profile updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Update your personal information</p>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="profile-grid">
        <div className="neo-card">
          <h2 style={{ marginBottom: 20 }}>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" value={user?.email || ''} disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" className="form-control" placeholder="9876543210"
                value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <select name="branch" className="form-control" value={form.branch} onChange={handleChange}>
                <option value="">Select Branch</option>
                <option value="CSE">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EE">Electrical Engineering</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>CGPA</label>
              <input type="number" name="cgpa" className="form-control" step="0.01"
                min="0" max="10" value={form.cgpa} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Resume URL</label>
              <input type="url" name="resumeUrl" className="form-control"
                placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div>
          <div className="neo-card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 12 }}>Quick Info</h3>
            <div className="detail-info-item" style={{ marginBottom: 10 }}>
              <div className="info-label">Name</div>
              <div className="info-value">{user?.name}</div>
            </div>
            <div className="detail-info-item" style={{ marginBottom: 10 }}>
              <div className="info-label">Email</div>
              <div className="info-value">{user?.email}</div>
            </div>
            <div className="detail-info-item" style={{ marginBottom: 10 }}>
              <div className="info-label">Branch</div>
              <div className="info-value">{user?.branch || 'Not set'}</div>
            </div>
            <div className="detail-info-item">
              <div className="info-label">CGPA</div>
              <div className="info-value">{user?.cgpa || 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

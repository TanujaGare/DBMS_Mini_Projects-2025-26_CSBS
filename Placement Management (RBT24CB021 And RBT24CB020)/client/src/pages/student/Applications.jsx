import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/applications/my').then(res => {
      setApplications(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter);

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Applications</h1>
          <p>Track all your placement applications</p>
        </div>
        <div className="flex gap-sm">
          {['all', 'pending', 'shortlisted', 'selected', 'rejected'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card">
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications found</h3>
            <p>{filter === 'all' ? 'Start applying to placement drives!' : `No ${filter} applications.`}</p>
          </div>
        </div>
      ) : (
        <div className="neo-card-flat">
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Location</th>
                  <th>CTC</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.drive?.company?.name || 'N/A'}</td>
                    <td>{app.drive?.position || 'N/A'}</td>
                    <td>{app.drive?.jobLocation || '—'}</td>
                    <td>{app.drive?.ctc || '—'}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

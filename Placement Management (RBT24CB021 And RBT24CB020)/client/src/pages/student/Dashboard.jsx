import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ drives: 0, applied: 0, selected: 0, pending: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          api.get('/drives'),
          api.get('/applications/my')
        ]);
        const apps = appsRes.data;
        setStats({
          drives: drivesRes.data.filter(d => d.status !== 'completed').length,
          applied: apps.length,
          selected: apps.filter(a => a.status === 'selected').length,
          pending: apps.filter(a => a.status === 'pending').length,
        });
        setRecentApps(apps.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Here's your placement overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineBriefcase /></div>
          <div className="stat-info">
            <h3>{stats.drives}</h3>
            <p>Active Drives</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><HiOutlineDocumentText /></div>
          <div className="stat-info">
            <h3>{stats.applied}</h3>
            <p>Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div className="stat-info">
            <h3>{stats.selected}</h3>
            <p>Selected</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineClock /></div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      <div className="neo-card">
        <h2 style={{ marginBottom: 16 }}>Recent Applications</h2>
        {recentApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Start exploring placement drives and apply to your dream companies!</p>
          </div>
        ) : (
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.drive?.company?.name || 'N/A'}</td>
                    <td>{app.drive?.position || 'N/A'}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

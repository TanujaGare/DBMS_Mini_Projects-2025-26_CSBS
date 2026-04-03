import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineClock, HiOutlineDocumentText } from 'react-icons/hi2';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, companies: 0, drives: 0, applications: 0, selected: 0, pending: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, companiesRes, drivesRes, appsRes] = await Promise.all([
          api.get('/students'),
          api.get('/companies'),
          api.get('/drives'),
          api.get('/applications/all'),
        ]);
        const apps = appsRes.data;
        setStats({
          students: studentsRes.data.length,
          companies: companiesRes.data.length,
          drives: drivesRes.data.length,
          applications: apps.length,
          selected: apps.filter(a => a.status === 'selected').length,
          pending: apps.filter(a => a.status === 'pending').length,
        });
        setRecentApps(apps.slice(0, 8));
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
        <h1>Admin Dashboard 🏛️</h1>
        <p>Overview of the placement management system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineUsers /></div>
          <div className="stat-info"><h3>{stats.students}</h3><p>Students</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineBuildingOffice2 /></div>
          <div className="stat-info"><h3>{stats.companies}</h3><p>Companies</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><HiOutlineBriefcase /></div>
          <div className="stat-info"><h3>{stats.drives}</h3><p>Drives</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineDocumentText /></div>
          <div className="stat-info"><h3>{stats.applications}</h3><p>Applications</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div className="stat-info"><h3>{stats.selected}</h3><p>Selected</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink"><HiOutlineClock /></div>
          <div className="stat-info"><h3>{stats.pending}</h3><p>Pending</p></div>
        </div>
      </div>

      <div className="neo-card">
        <h2 style={{ marginBottom: 16 }}>Recent Applications</h2>
        {recentApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applications yet</h3>
          </div>
        ) : (
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.student?.name || 'N/A'}</td>
                    <td>{app.drive?.company?.name || 'N/A'}</td>
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

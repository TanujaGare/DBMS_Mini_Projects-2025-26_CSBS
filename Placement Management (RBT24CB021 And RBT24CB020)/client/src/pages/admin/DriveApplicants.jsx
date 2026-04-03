import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function DriveApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [appsRes, driveRes] = await Promise.all([
        api.get(`/applications/drive/${id}`),
        api.get(`/drives/${id}`)
      ]);
      setApplications(appsRes.data);
      setDrive(driveRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Link to="/admin/drives" className="btn btn-sm btn-secondary" style={{ marginBottom: 16 }}>
        ← Back to Drives
      </Link>

      <div className="page-header">
        <h1>Applicants — {drive?.position}</h1>
        <p>{drive?.company?.name} · {applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {applications.length === 0 ? (
        <div className="neo-card">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No applicants yet</h3>
            <p>Students haven't applied to this drive yet.</p>
          </div>
        </div>
      ) : (
        <div className="neo-card-flat">
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Phone</th>
                  <th>Resume</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.student?.name || 'N/A'}</td>
                    <td>{app.student?.email || '—'}</td>
                    <td>{app.student?.branch || '—'}</td>
                    <td>{app.student?.cgpa || '—'}</td>
                    <td>{app.student?.phone || '—'}</td>
                    <td>
                      {app.student?.resumeUrl ? (
                        <a href={app.student.resumeUrl} target="_blank" rel="noreferrer"
                          className="btn btn-sm btn-secondary">View</a>
                      ) : '—'}
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                    <td>
                      <select
                        className="form-control"
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        style={{ padding: '6px 10px', fontSize: '0.82rem', minWidth: 120, boxShadow: '2px 2px 0 var(--border)' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
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

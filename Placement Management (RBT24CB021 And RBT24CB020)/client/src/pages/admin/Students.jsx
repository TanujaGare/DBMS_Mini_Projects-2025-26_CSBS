import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/students').then(res => {
      setStudents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.branch?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Students</h1>
          <p>{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300, boxShadow: '3px 3px 0 var(--border)' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card">
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No students found</h3>
            <p>{search ? 'Try a different search term.' : 'No students have registered yet.'}</p>
          </div>
        </div>
      ) : (
        <div className="neo-card-flat">
          <div className="neo-table-wrap">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Phone</th>
                  <th>Resume</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.branch || '—'}</td>
                    <td>{s.cgpa || '—'}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      {s.resumeUrl ? (
                        <a href={s.resumeUrl} target="_blank" rel="noreferrer"
                          className="btn btn-sm btn-secondary">View</a>
                      ) : '—'}
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
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

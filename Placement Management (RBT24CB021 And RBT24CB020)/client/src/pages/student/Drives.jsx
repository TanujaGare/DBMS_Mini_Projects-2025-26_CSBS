import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { HiOutlineMapPin, HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineAcademicCap } from 'react-icons/hi2';

export default function StudentDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/drives').then(res => {
      setDrives(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? drives : drives.filter(d => d.status === filter);

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Placement Drives</h1>
          <p>Browse and apply to active placement drives</p>
        </div>
        <div className="flex gap-sm">
          {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
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
            <div className="empty-icon">📋</div>
            <h3>No drives found</h3>
            <p>Check back later for new placement opportunities.</p>
          </div>
        </div>
      ) : (
        <div className="drives-grid">
          {filtered.map(drive => (
            <div className="drive-card" key={drive._id}>
              <div className="drive-card-header">
                <div>
                  <h3>{drive.position}</h3>
                  <div className="drive-card-company">{drive.company?.name || 'Unknown'}</div>
                </div>
                <span className={`badge badge-${drive.status}`}>{drive.status}</span>
              </div>
              <div className="drive-card-meta">
                {drive.jobLocation && (
                  <span className="meta-chip"><HiOutlineMapPin /> {drive.jobLocation}</span>
                )}
                {drive.ctc && (
                  <span className="meta-chip"><HiOutlineCurrencyRupee /> {drive.ctc}</span>
                )}
                {drive.minCGPA > 0 && (
                  <span className="meta-chip"><HiOutlineAcademicCap /> Min {drive.minCGPA} CGPA</span>
                )}
                {drive.arrivalDate && (
                  <span className="meta-chip"><HiOutlineCalendar /> {new Date(drive.arrivalDate).toLocaleDateString()}</span>
                )}
              </div>
              {drive.skillsRequired?.length > 0 && (
                <div className="skills-wrap">
                  {drive.skillsRequired.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                </div>
              )}
              <div className="drive-card-actions">
                <Link to={`/student/drives/${drive._id}`} className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

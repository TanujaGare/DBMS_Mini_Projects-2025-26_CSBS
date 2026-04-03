import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function DriveDetails() {
  const { id } = useParams();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driveRes, appsRes] = await Promise.all([
          api.get(`/drives/${id}`),
          api.get('/applications/my')
        ]);
        setDrive(driveRes.data);
        const alreadyApplied = appsRes.data.some(a => a.drive?._id === id);
        setApplied(alreadyApplied);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load drive details' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/applications', { driveId: id });
      setApplied(true);
      setMessage({ type: 'success', text: 'Application submitted successfully! 🎉' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loader-wrap"><div className="loader"></div></div></DashboardLayout>;
  if (!drive) return <DashboardLayout><div className="alert alert-error">Drive not found</div></DashboardLayout>;

  const isPastDeadline = drive.deadline && new Date(drive.deadline) < new Date();

  return (
    <DashboardLayout>
      <Link to="/student/drives" className="btn btn-sm btn-secondary" style={{ marginBottom: 16 }}>
        ← Back to Drives
      </Link>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="neo-card" style={{ marginBottom: 20 }}>
        <div className="detail-header">
          <div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>{drive.position}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {drive.company?.name || 'Unknown Company'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`badge badge-${drive.status}`}>{drive.status}</span>
          </div>
        </div>

        <div className="detail-info-grid">
          {drive.jobLocation && (
            <div className="detail-info-item">
              <div className="info-label">📍 Location</div>
              <div className="info-value">{drive.jobLocation}</div>
            </div>
          )}
          {drive.ctc && (
            <div className="detail-info-item">
              <div className="info-label">💰 CTC</div>
              <div className="info-value">{drive.ctc}</div>
            </div>
          )}
          {drive.stipend && (
            <div className="detail-info-item">
              <div className="info-label">💵 Stipend</div>
              <div className="info-value">{drive.stipend}</div>
            </div>
          )}
          {drive.minCGPA > 0 && (
            <div className="detail-info-item">
              <div className="info-label">🎓 Min CGPA</div>
              <div className="info-value">{drive.minCGPA}</div>
            </div>
          )}
          {drive.arrivalDate && (
            <div className="detail-info-item">
              <div className="info-label">📅 Arrival Date</div>
              <div className="info-value">{new Date(drive.arrivalDate).toLocaleDateString()}</div>
            </div>
          )}
          {drive.deadline && (
            <div className="detail-info-item">
              <div className="info-label">⏰ Deadline</div>
              <div className="info-value">{new Date(drive.deadline).toLocaleDateString()}</div>
            </div>
          )}
        </div>

        {drive.description && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 8 }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{drive.description}</p>
          </div>
        )}

        {drive.selectionProcedure && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 8 }}>Selection Procedure</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{drive.selectionProcedure}</p>
          </div>
        )}

        {drive.skillsRequired?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Skills Required</h3>
            <div className="skills-wrap">
              {drive.skillsRequired.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
            </div>
          </div>
        )}

        <button
          className={`btn btn-lg ${applied ? 'btn-accent' : 'btn-primary'} btn-block`}
          onClick={handleApply}
          disabled={applied || applying || isPastDeadline || drive.status === 'completed'}
        >
          {applied ? '✓ Already Applied' : applying ? 'Submitting...' : isPastDeadline ? 'Deadline Passed' : 'Apply Now'}
        </button>
      </div>
    </DashboardLayout>
  );
}

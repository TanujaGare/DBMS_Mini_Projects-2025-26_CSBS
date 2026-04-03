import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineRocketLaunch, HiOutlineBuildingOffice2, HiOutlineChartBarSquare } from 'react-icons/hi2';

export default function Home() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />;
  }

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-nav-brand">
          <span className="brand-icon"><HiOutlineAcademicCap /></span>
          PlaceMe
        </div>
        <div className="home-nav-links">
          <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
        </div>
      </nav>

      <section className="home-hero">
        <h1>
          Your Gateway to<br />
          <span className="highlight">Dream Placements</span>
        </h1>
        <p>
          Streamlined placement management for students and administrators.
          Browse drives, apply with one click, and track your journey.
        </p>
        <div className="home-hero-actions">
          <Link to="/register" className="btn btn-lg btn-primary">
            <HiOutlineRocketLaunch /> Get Started
          </Link>
          <Link to="/login" className="btn btn-lg btn-secondary">Login →</Link>
        </div>
      </section>

      <section className="home-features">
        <div className="home-feature-card">
          <div className="feature-icon" style={{ background: 'var(--primary)' }}>🎯</div>
          <h3>Smart Matching</h3>
          <p>Auto-filter drives based on your CGPA and branch. Only see opportunities you're eligible for.</p>
        </div>
        <div className="home-feature-card">
          <div className="feature-icon" style={{ background: 'var(--accent-blue)' }}>
            <HiOutlineBuildingOffice2 />
          </div>
          <h3>Top Companies</h3>
          <p>Access placement drives from leading companies. All in one centralized platform.</p>
        </div>
        <div className="home-feature-card">
          <div className="feature-icon" style={{ background: 'var(--accent-pink)' }}>
            <HiOutlineChartBarSquare />
          </div>
          <h3>Live Tracking</h3>
          <p>Real-time application status tracking. Know instantly when you're shortlisted or selected.</p>
        </div>
      </section>
    </div>
  );
}

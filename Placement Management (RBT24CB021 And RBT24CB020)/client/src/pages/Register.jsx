import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap } from 'react-icons/hi2';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', branch: '', cgpa: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, cgpa: parseFloat(form.cgpa) || 0 });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-logo"><HiOutlineAcademicCap /></div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>PlaceMe</h2>
        </div>
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join as a student</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="form-control" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" className="form-control" placeholder="9876543210"
                  value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input type="number" name="cgpa" className="form-control" placeholder="8.5"
                  step="0.01" min="0" max="10" value={form.cgpa} onChange={handleChange} />
              </div>
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
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

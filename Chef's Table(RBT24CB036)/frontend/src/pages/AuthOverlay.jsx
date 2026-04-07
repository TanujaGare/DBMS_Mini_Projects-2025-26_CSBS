import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthOverlay() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chef');
  const [status, setStatus] = useState('');

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      setStatus('Please enter both fields.');
      return;
    }
    try {
      let result;
      if (mode === 'register') {
        result = await register(username.trim(), username.trim(), password.trim(), role);
      } else {
        result = await login(username.trim(), password.trim());
      }
      if (!result.success) {
        setStatus(result.message || 'Auth failed.');
      }
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div className="modal-bg open" style={{ zIndex: 500, alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal" style={{ width: 360, maxWidth: '95vw' }}>
        <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <button
            className={`btn btn-outline ${mode === 'login' ? 'btn-gold' : ''}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('login'); setStatus(''); }}
          >
            Login
          </button>
          <button
            className={`btn btn-outline ${mode === 'register' ? 'btn-gold' : ''}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('register'); setStatus(''); }}
          >
            Register
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <input
            placeholder="Username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {mode === 'register' && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="chef">Chef</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-gold" onClick={handleSubmit}>
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </div>
        {status && <p style={{ marginTop: 12, color: '#f39c12', fontSize: 12 }}>{status}</p>}
      </div>
    </div>
  );
}

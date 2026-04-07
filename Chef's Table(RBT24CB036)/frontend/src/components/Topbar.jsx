import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ pageTitle }) {
  const { logout } = useAuth();
  const [time, setTime] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-title">{pageTitle}</div>
      <div className="topbar-right">
        <div className="time-badge">{time}</div>
        <button className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }} onClick={logout}>
          Logout
        </button>
        <div className="status-dot" title="System Online"></div>
      </div>
    </div>
  );
}

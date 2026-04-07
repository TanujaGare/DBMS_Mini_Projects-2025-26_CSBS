import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (usernameOrEmail, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });
    const payload = await res.json();
    if (payload.token) {
      setToken(payload.token);
      setUser(payload.user);
      localStorage.setItem('ct_app_token', payload.token);
      localStorage.setItem('ct_app_user', JSON.stringify(payload.user));
      return { success: true };
    }
    return { success: false, message: payload.message || 'Login failed' };
  }, []);

  const register = useCallback(async (username, email, password, role) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });
    const payload = await res.json();
    if (payload.token) {
      setToken(payload.token);
      setUser(payload.user);
      localStorage.setItem('ct_app_token', payload.token);
      localStorage.setItem('ct_app_user', JSON.stringify(payload.user));
      return { success: true };
    }
    return { success: false, message: payload.message || 'Registration failed' };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ct_app_token');
    localStorage.removeItem('ct_app_user');
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('ct_app_token');
    if (!savedToken) { setLoading(false); return; }
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: 'Bearer ' + savedToken }
    })
      .then(res => { if (!res.ok) throw new Error('expired'); return res.json(); })
      .then(data => {
        setToken(savedToken);
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('ct_app_token');
        localStorage.removeItem('ct_app_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ token, user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

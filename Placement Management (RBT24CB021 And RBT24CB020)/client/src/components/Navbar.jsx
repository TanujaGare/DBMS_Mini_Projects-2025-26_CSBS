import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap } from 'react-icons/hi2';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon"><HiOutlineAcademicCap /></span>
        PlaceMe
      </Link>
      <div className="navbar-right">
        {user && (
          <>
            <div className="navbar-user">
              <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
              {user.name}
            </div>
            <button className="btn btn-sm btn-secondary" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineUsers,
} from 'react-icons/hi2';

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    { to: '/admin/dashboard', icon: <HiOutlineSquares2X2 />, label: 'Dashboard' },
    { to: '/admin/companies', icon: <HiOutlineBuildingOffice2 />, label: 'Companies' },
    { to: '/admin/drives', icon: <HiOutlineBriefcase />, label: 'Drives' },
    { to: '/admin/students', icon: <HiOutlineUsers />, label: 'Students' },
  ];

  const studentLinks = [
    { to: '/student/dashboard', icon: <HiOutlineSquares2X2 />, label: 'Dashboard' },
    { to: '/student/drives', icon: <HiOutlineBriefcase />, label: 'Placement Drives' },
    { to: '/student/applications', icon: <HiOutlineDocumentText />, label: 'My Applications' },
    { to: '/student/profile', icon: <HiOutlineUserCircle />, label: 'Profile' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">
          {isAdmin ? 'Administration' : 'Student Portal'}
        </div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

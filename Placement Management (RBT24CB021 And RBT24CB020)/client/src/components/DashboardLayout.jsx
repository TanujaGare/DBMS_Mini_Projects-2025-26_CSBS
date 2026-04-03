import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="app-layout" style={{ paddingTop: '64px' }}>
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}

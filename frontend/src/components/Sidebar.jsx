import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  LogOut, 
  User
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logoDuplicate.png";

const Sidebar = () => {
  const { logout, admin } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Properties", path: "/properties", icon: <Home size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={Logo} alt="EasyRent Logo" className="sidebar-logo" />
        <span className="sidebar-title">EasyRentalNepal</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile-compact">
          <div className="admin-avatar-small">
            <User size={16} />
          </div>
          <div className="admin-info-small">
            <div className="name">Admin</div>
            <div className="email">{admin?.email}</div>
          </div>
        </div>
        
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 50;
          box-shadow: var(--shadow);
        }

        .sidebar-header {
          padding: 1.5rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .sidebar-logo {
          width: auto;
          height: 32px;
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.25rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          border-radius: var(--radius);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }

        .nav-link:hover {
          background: var(--bg-main);
          color: var(--text-main);
        }

        .nav-link.active {
          background: var(--color-secondary);
          color: #1a1200;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(253, 199, 0, 0.3);
        }

        .nav-link.active svg {
          color: #1a1200;
        }

        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--border);
          background: var(--bg-main);
        }

        .admin-profile-compact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 0.75rem;
        }

        .admin-avatar-small {
          width: 32px;
          height: 32px;
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .admin-info-small {
          overflow: hidden;
        }

        .admin-info-small .name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .admin-info-small .email {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          background: transparent;
          border: none;
          color: var(--danger);
          cursor: pointer;
          border-radius: var(--radius);
          transition: background 0.15s, color 0.15s;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: var(--danger);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
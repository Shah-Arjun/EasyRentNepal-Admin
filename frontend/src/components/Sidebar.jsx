import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  LogOut, 
  Settings,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Properties", path: "/properties", icon: <Home size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
    // { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <ShieldCheck size={32} className="sidebar-logo" />
        <span className="sidebar-title">EasyRentalNepal Admin</span>
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
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background: #1e293b;
          color: white;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-logo {
          color: #818cf8;
        }

        .sidebar-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          color: #94a3b8;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .nav-link.active {
          background: var(--primary);
          color: white;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          border-radius: var(--radius);
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

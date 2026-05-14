import React from "react";
import { User, Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { admin } = useAuth();

  return (
    <header className="navbar">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="navbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="admin-profile">
          <div className="admin-info">
            <span className="admin-name">Admin</span>
            <span className="admin-email">{admin?.email}</span>
          </div>
          <div className="admin-avatar">
            <User size={20} />
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: var(--header-height);
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .search-bar {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar input {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: #f8fafc;
          font-size: 0.875rem;
          outline: none;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          position: relative;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background: #f1f5f9;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border-radius: 50%;
          border: 2px solid white;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-left: 1.5rem;
          border-left: 1px solid var(--border);
        }

        .admin-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .admin-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .admin-email {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
      `}</style>
    </header>
  );
};

export default Navbar;

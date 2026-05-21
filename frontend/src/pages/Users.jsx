import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Eye,
  Home,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (role) params.role = role;

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        params,
        withCredentials: true
      });
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [role]); // search triggered on submit

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="users-page fade-in">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage and monitor all registered tenants and owners</p>
      </div>

      <div className="filters-card card">
        <form onSubmit={handleSearchSubmit} className="filters-grid">
          <div className="search-box">
            <Search className="icon" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="select-box">
            <Filter className="icon" size={18} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="tenant">Tenant Only</option>
              <option value="owner">Owner Only</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Apply"}
          </button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Identity</th>
              <th>Contact Details</th>
              <th>System Roles</th>
              <th>Listed</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin mx-auto" size={32} />
                <p className="mt-2 text-muted">Loading users...</p>
              </td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">
                        <UserIcon size={20} />
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name || "N/A"}</div>
                        <div className="user-id">ID: {user._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="email"><Mail size={14} /> {user.email}</div>
                      {user.phoneNumber && <div className="phone">📞 {user.phoneNumber}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="roles-cell">
                      {user.role.map((r, i) => (
                        <span key={i} className={`badge badge-info`}>{r}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="prop-count">
                      <Home size={14} /> {user.propertyCount} properties
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${user.isOtpVerified ? 'success' : 'warning'}`}>
                      {user.isOtpVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <Link to={`/users/${user._id}`} className="btn btn-outline btn-sm">
                      <Eye size={16} />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mt-2 { margin-top: 0.5rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .filters-card { margin-bottom: 1.5rem; }
        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        .search-box, .select-box { position: relative; display: flex; align-items: center; }
        .search-box .icon, .select-box .icon { position: absolute; left: 12px; color: var(--text-muted); pointer-events: none; }
        .search-box input, .select-box select {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          outline: none;
          background: #fff;
        }
        .user-cell { display: flex; align-items: center; gap: 0.75rem; }
        .avatar {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }
        .user-name { font-weight: 600; color: var(--text-main); }
        .user-id { font-size: 0.75rem; color: var(--text-muted); }
        .contact-cell { font-size: 0.875rem; }
        .contact-cell .email, .contact-cell .phone { display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); }
        .prop-count { display: flex; align-items: center; gap: 0.4rem; font-weight: 500; }
        .roles-cell { display: flex; gap: 0.4rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
};

export default Users;

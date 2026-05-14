import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  MapPin, 
  User, 
  Calendar,
  AlertCircle,
  Loader2,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [embedding, setEmbedding] = useState("");

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (featured) params.featured = featured;
      if (embedding) params.embedding = embedding;

      const { data } = await axios.get(`http://localhost:5000/api/admin/properties`, {
        params,
        withCredentials: true
      });
      
      if (data.success) {
        setProperties(data.properties);
      } else {
        throw new Error(data.message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      const msg = err.response?.data?.message || err.message || "Failed to load properties";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [status, featured, embedding]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const toggleFeatured = async (id) => {
    try {
      const { data } = await axios.patch(`http://localhost:5000/api/admin/properties/${id}/toggle-featured`, {}, {
        withCredentials: true
      });
      if (data.success) {
        toast.success(data.message);
        setProperties(prev => prev.map(p => p._id === id ? data.property : p));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle featured status");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const { data } = await axios.delete(`http://localhost:5000/api/admin/properties/${id}`, {
          withCredentials: true
        });
        if (data.success) {
          toast.success("Property deleted successfully");
          setProperties(prev => prev.filter(p => p._id !== id));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete property");
      }
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Properties</h1>
        <p>Manage listing inventory</p>
      </div>

      <div className="filters-card card">
        <form onSubmit={handleSearchSubmit} className="filters-grid">
          <div className="search-box">
            <Search className="icon" size={18} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <div className="select-box">
              <Filter className="icon" size={18} />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Status: All</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div className="select-box">
              <Star className="icon" size={18} />
              <select value={featured} onChange={(e) => setFeatured(e.target.value)}>
                <option value="">Featured: All</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured</option>
              </select>
            </div>

            <div className="select-box">
              <Search className="icon" size={18} />
              <select value={embedding} onChange={(e) => setEmbedding(e.target.value)}>
                <option value="">Embedding: All</option>
                <option value="true">With Embedding</option>
                <option value="false">Without Embedding</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Search"}
          </button>
        </form>
      </div>

      {error ? (
        <div className="error-state card">
          <AlertCircle size={40} className="text-danger" />
          <h3>Connection Error</h3>
          <p>{error}</p>
          <button onClick={fetchProperties} className="btn btn-outline mt-4">Retry</button>
        </div>
      ) : (
        <div className="table-responsive card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th className="hide-mobile">Owner</th>
                <th className="hide-mobile">Location</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-center">Featured</th>
                <th className="text-center">Embedding</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && properties.length === 0 ? (
                <tr>
                  <td colSpan="8" className="loading-td">
                    <Loader2 className="animate-spin mx-auto" size={32} />
                    <p className="mt-2">Loading data...</p>
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-td">
                    <p>No listings found</p>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property._id}>
                    <td>
                      <div className="property-cell">
                        <span className="property-title">{property.title}</span>
                        <span className="property-meta">{property.category}</span>
                        {/* Mobile only location info */}
                        <span className="show-mobile mobile-loc">
                          <MapPin size={10} /> {property.location?.city || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <Link to={`/users/${property.owner?._id}`} className="owner-link">
                        {property.owner?.name || "N/A"}
                      </Link>
                    </td>
                    <td className="hide-mobile">
                      <div className="location-cell">
                        {property.location?.city || "N/A"}
                      </div>
                    </td>
                    <td>
                      <span className="price">Rs. {property.price?.value?.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${property.status?.toLowerCase()}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        onClick={() => toggleFeatured(property._id)}
                        className={`featured-btn ${property.isFeatured ? 'active' : ''}`}
                      >
                        <Star size={18} fill={property.isFeatured ? "#f59e0b" : "none"} />
                      </button>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${property.hasEmbedding ? 'badge-available' : 'badge-sold'}`}>
                        {property.hasEmbedding ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-btns">
                        <Link to={`/properties/${property._id}`} className="icon-action view" title="View Details">
                          <Eye size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(property._id, property.title)}
                          className="icon-action delete" 
                          title="Delete Property"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .properties-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        .page-header h1 {
          font-size: 1.75rem;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-muted);
        }

        .filters-card {
          margin-bottom: 1.5rem;
          padding: 1.25rem;
        }

        .filters-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .filter-group {
          display: flex;
          gap: 1rem;
          flex: 2;
          min-width: 300px;
        }

        .search-box .icon, .select-box .icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-box input, .select-box select {
          width: 100%;
          padding: 0.625rem 0.75rem 0.625rem 2.25rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: #fff;
          font-size: 0.875rem;
          outline: none;
        }

        .select-box {
          position: relative;
          flex: 1;
        }

        .table-responsive {
          overflow-x: auto;
          background: white;
          padding: 0;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .admin-table th {
          background: #f8fafc;
          padding: 1rem;
          font-weight: 600;
          color: var(--text-muted);
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .property-cell {
          display: flex;
          flex-direction: column;
        }

        .property-title {
          font-weight: 600;
          color: var(--text-main);
          display: block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .property-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        @media (max-width: 1024px) {
          .property-title {
            max-width: 150px;
          }
        }

        .price {
          font-weight: 600;
          color: var(--text-main);
        }

        .badge {
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-available { background: #dcfce7; color: #15803d; }
        .badge-rented { background: #fef9c3; color: #a16207; }
        .badge-sold { background: #fee2e2; color: #b91c1c; }

        .featured-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #e2e8f0;
          transition: all 0.2s;
        }

        .featured-btn.active {
          color: #f59e0b;
        }

        .action-btns {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .icon-action {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
        }

        .icon-action.view:hover {
          background: #e0f2fe;
          color: #0369a1;
        }

        .icon-action.delete:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .owner-link {
          color: var(--primary);
          text-decoration: none;
        }

        .owner-link:hover {
          text-decoration: underline;
        }

        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }

        .show-mobile { display: none; }

        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .show-mobile { display: flex; }
          
          .filters-grid {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            flex-direction: column;
            min-width: 0;
          }

          .mobile-loc {
            font-size: 0.7rem;
            color: var(--text-muted);
            align-items: center;
            gap: 2px;
            margin-top: 2px;
          }

          .admin-table th, .admin-table td {
            padding: 0.75rem;
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Properties;

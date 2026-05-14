import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  MapPin, 
  User, 
  Calendar,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/admin/properties`, {
        params: { search, status, featured }
      });
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [status, featured]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const toggleFeatured = async (id) => {
    try {
      const { data } = await axios.patch(`http://localhost:5000/api/admin/properties/${id}/toggle-featured`);
      if (data.success) {
        toast.success(data.message);
        setProperties(properties.map(p => p._id === id ? data.property : p));
      }
    } catch (error) {
      toast.error("Failed to toggle featured status");
    }
  };

  return (
    <div className="properties-page fade-in">
      <div className="page-header flex justify-between">
        <div>
          <h1>Property Management</h1>
          <p>View and manage all property listings</p>
        </div>
      </div>

      <div className="filters-card card">
        <form onSubmit={handleSearch} className="filters-grid">
          <div className="search-box">
            <Search className="icon" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="select-box">
            <Filter className="icon" size={18} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="select-box">
            <Star className="icon" size={18} />
            <select value={featured} onChange={(e) => setFeatured(e.target.value)}>
              <option value="">Featured Status</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Apply Filters</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No properties found</td></tr>
            ) : (
              properties.map((property) => (
                <tr key={property._id}>
                  <td>
                    <div className="property-cell">
                      <div className="property-title">{property.title}</div>
                      <div className="property-type">{property.propertyType}</div>
                    </div>
                  </td>
                  <td>
                    <Link to={`/users/${property.owner?._id}`} className="owner-link">
                      <User size={14} />
                      {property.owner?.name || "Unknown"}
                    </Link>
                  </td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={14} />
                      {property.location?.city}, {property.location?.district}
                    </div>
                  </td>
                  <td className="price-cell">Rs. {property.price.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${
                      property.status === 'Available' ? 'success' : 
                      property.status === 'Rented' ? 'warning' : 'danger'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleFeatured(property._id)}
                      className={`featured-toggle ${property.isFeatured ? 'active' : ''}`}
                    >
                      <Star size={18} fill={property.isFeatured ? "#f59e0b" : "none"} />
                    </button>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <Link to={`/properties/${property._id}`} className="btn btn-outline btn-sm">
                      <Eye size={16} />
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .filters-card {
          margin-bottom: 1.5rem;
        }
        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        .search-box, .select-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-box .icon, .select-box .icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-box input, .select-box select {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          outline: none;
          background: #f8fafc;
        }
        .owner-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-weight: 500;
        }
        .owner-link:hover {
          text-decoration: underline;
        }
        .location-cell, .date-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .price-cell {
          font-weight: 600;
          color: var(--text-main);
        }
        .featured-toggle {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          transition: transform 0.2s;
        }
        .featured-toggle:hover {
          transform: scale(1.2);
        }
        .featured-toggle.active {
          color: #f59e0b;
        }
        .property-title {
          font-weight: 600;
          color: var(--text-main);
        }
        .property-type {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default Properties;

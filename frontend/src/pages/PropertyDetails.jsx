import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle,
  Info,
  Images,
  Star,
  Loader2,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/properties/${id}`, {
          withCredentials: true
        });
        if (data.success) {
          setProperty(data.property);
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError(err.response?.data?.message || "Failed to load property details");
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  if (loading) return (
    <div className="loading-state">
      <Loader2 className="animate-spin" size={40} />
      <p>Loading property details...</p>
    </div>
  );

  if (error || !property) return (
    <div className="error-state card">
      <AlertTriangle size={48} className="text-danger" />
      <h2>Something went wrong</h2>
      <p>{error || "Property not found"}</p>
      <Link to="/properties" className="btn btn-primary mt-8"><ArrowLeft size={18} />Back to Listings</Link>
    </div>
  );

  return (
    <div className="property-details-page fade-in">
      <div className="page-actions">
        <Link to="/properties" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Properties</span>
        </Link>
      </div>

      <div className="details-layout">
        <div className="main-column">
          <div className="card property-main-card">
            <div className="property-header">
              <div className="header-top">
                <div className="title-section">
                  <h1 className="title">{property.title}</h1>
                  <div className="location">
                    <MapPin size={16} />
                    <span>{property.location?.city}, {property.location?.district}</span>
                  </div>
                </div>
                <div className="price-badge">
                  <span className="currency">Rs.</span>
                  <span className="amount">{property.price?.value?.toLocaleString()}</span>
                  {property.price?.perUnit && <span className="unit">/{property.price.perUnit}</span>}
                </div>
              </div>
              
              <div className="status-badges">
                <span className={`badge badge-${property.status?.toLowerCase()}`}>
                  {property.status}
                </span>
                {property.isFeatured && (
                  <span className="badge badge-featured">
                    <Star size={12} fill="currentColor" />
                    <span>Featured</span>
                  </span>
                )}
                <span className="badge badge-outline">{property.category}</span>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title"><Images size={20} /> Media Gallery</h3>
              <div className="image-grid">
                {property.images && property.images.length > 0 ? (
                  property.images.map((img, i) => (
                    <div key={i} className="gallery-item">
                      <img src={img.url} alt={`Property ${i}`} />
                    </div>
                  ))
                ) : (
                  <div className="empty-gallery">No images uploaded for this property</div>
                )}
              </div>
            </div>

            <div className="section">
              <h3 className="section-title"><Info size={20} /> Description</h3>
              <div className="description-text">
                {property.description}
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="section">
                <h3 className="section-title">Amenities & Features</h3>
                <div className="amenities-wrap">
                  {property.amenities.map((item, i) => (
                    <div key={i} className="amenity-tag">
                      <CheckCircle size={14} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="side-column">
          <div className="card side-card">
            <h3 className="card-title"><User size={18} /> Publisher Information</h3>
            <div className="publisher-profile">
              <div className="publisher-avatar-circle">
                {property.owner?.name?.charAt(0) || "?"}
              </div>
              <div className="publisher-info">
                <div className="publisher-name">{property.owner?.name || "Unknown Agency"}</div>
                <div className="publisher-email">{property.owner?.email}</div>
                <Link to={`/users/${property.owner?._id}`} className="publisher-link">
                  View full profile
                </Link>
              </div>
            </div>
          </div>

          <div className="card side-card">
            <h3 className="card-title"><Calendar size={18} /> Booking History</h3>
            <div className="bookings-container">
              {property.bookings && property.bookings.length > 0 ? (
                property.bookings.map((booking, i) => (
                  <div key={i} className="booking-row">
                    <div className="tenant-info">
                      <span className="tenant-name">{booking.tenant?.name || "Deleted User"}</span>
                      <span className="booking-id">#{booking._id?.slice(-6)}</span>
                    </div>
                    <div className="booking-date">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No bookings recorded yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10rem 0;
          gap: 1rem;
          color: var(--text-muted);
        }
        .error-state {
          text-align: center;
          padding: 4rem;
          max-width: 500px;
          margin: 4rem auto;
        }
        .page-actions { margin-bottom: 1.5rem; }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--primary); }
        
        .details-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          align-items: start;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        .price-badge {
          background: #f0f9ff;
          color: #0369a1;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-badge .amount { font-size: 1.5rem; font-weight: 800; }
        .price-badge .currency, .price-badge .unit { font-size: 0.875rem; font-weight: 600; }

        .status-badges { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
        .badge-featured { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; display: flex; align-items: center; gap: 0.4rem; }
        .badge-outline { background: white; border: 1px solid var(--border); color: var(--text-muted); }

        .section { margin-top: 2.5rem; padding-top: 2.5rem; border-top: 1px solid #f1f5f9; }
        .section-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; }

        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .gallery-item img { width: 100%; height: 150px; object-fit: cover; border-radius: 0.75rem; transition: transform 0.2s; }
        .gallery-item:hover img { transform: scale(1.02); }

        .description-text { line-height: 1.6; color: #475569; font-size: 1.1rem; }

        .amenities-wrap { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .amenity-tag { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 9999px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 500; }

        .side-card { padding: 1.5rem; margin-bottom: 1.5rem; }
        .card-title { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
        
        .publisher-profile { display: flex; gap: 1rem; align-items: center; }
        .publisher-avatar-circle { 
          width: 56px; 
          height: 56px; 
          border-radius: 50%; 
          background: #e0f2fe; 
          color: #0369a1; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 1.5rem; 
          font-weight: 700;
          flex-shrink: 0;
        }
        .publisher-name { font-weight: 700; color: #0f172a; }
        .publisher-email { font-size: 0.8125rem; color: #64748b; margin-bottom: 0.5rem; }
        .publisher-link { color: var(--primary); font-size: 0.8125rem; font-weight: 600; text-decoration: underline; }

        .booking-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
        .booking-row:last-child { border-bottom: none; }
        .tenant-name { display: block; font-weight: 600; font-size: 0.875rem; }
        .booking-id { font-size: 0.75rem; color: #94a3b8; }
        .booking-date { font-size: 0.75rem; color: #64748b; }
        .no-data { font-size: 0.875rem; color: #94a3b8; text-align: center; padding: 1rem 0; }

        @media (max-width: 1024px) {
          .details-layout { grid-template-columns: 1fr; }
          .side-column { order: 2; }
          .main-column { order: 1; }
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PropertyDetails;

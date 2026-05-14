import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Tag, 
  Calendar, 
  CheckCircle,
  Home,
  Info,
  Images,
  Star
} from "lucide-react";
import toast from "react-hot-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/properties/${id}`);
        if (data.success) {
          setProperty(data.property);
        }
      } catch (error) {
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  if (loading) return <div className="p-8">Loading property details...</div>;
  if (!property) return <div className="p-8">Property not found</div>;

  return (
    <div className="property-details-page fade-in">
      <div className="mb-6">
        <Link to="/properties" className="btn btn-outline">
          <ArrowLeft size={18} />
          Back to Properties
        </Link>
      </div>

      <div className="details-grid">
        <div className="main-info">
          <div className="card">
            <div className="property-header">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="title">{property.title}</h1>
                  <div className="location">
                    <MapPin size={18} />
                    {property.location.city}, {property.location.district}, {property.location.province}
                  </div>
                </div>
                <div className="price-tag">
                  Rs. {property.price.toLocaleString()}
                </div>
              </div>
              
              <div className="badges mt-4">
                <span className={`badge badge-${property.status === 'Available' ? 'success' : 'warning'}`}>
                  {property.status}
                </span>
                {property.isFeatured && (
                  <span className="badge badge-info ml-2">
                    <Star size={12} fill="currentColor" /> Featured
                  </span>
                )}
                <span className="badge badge-outline ml-2">{property.propertyType}</span>
              </div>
            </div>

            <div className="image-gallery mt-8">
              <h3><Images size={20} /> Property Images</h3>
              <div className="images-grid">
                {property.images && property.images.length > 0 ? (
                  property.images.map((img, i) => (
                    <img key={i} src={img.url} alt={`Property ${i}`} className="property-img" />
                  ))
                ) : (
                  <div className="no-images">No images available</div>
                )}
              </div>
            </div>

            <div className="description mt-8">
              <h3><Info size={20} /> Description</h3>
              <p>{property.description}</p>
            </div>

            <div className="amenities mt-8">
              <h3>Amenities</h3>
              <div className="amenities-list">
                {property.amenities.map((item, i) => (
                  <span key={i} className="amenity-item">
                    <CheckCircle size={14} className="text-success" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-info">
          <div className="card owner-card">
            <h3><User size={20} /> Owner Information</h3>
            <div className="owner-profile">
              <img 
                src={property.owner.profileImage?.url || "https://via.placeholder.com/60"} 
                alt={property.owner.name} 
                className="owner-avatar"
              />
              <div className="owner-details">
                <div className="name">{property.owner.name}</div>
                <div className="email">{property.owner.email}</div>
                <Link to={`/users/${property.owner._id}`} className="view-link">View Profile</Link>
              </div>
            </div>
          </div>

          <div className="card bookings-card mt-6">
            <h3><Calendar size={20} /> Bookings ({property.bookings?.length || 0})</h3>
            <div className="bookings-list">
              {property.bookings && property.bookings.length > 0 ? (
                property.bookings.map((booking, i) => (
                  <div key={i} className="booking-item">
                    <div className="tenant-name">{booking.tenant?.name}</div>
                    <div className="booking-date">{new Date(booking.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted text-sm">No bookings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        .property-header .title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .property-header .location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
        }
        .price-tag {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          background: #eef2ff;
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
        }
        h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: var(--text-main);
        }
        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        .property-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius);
        }
        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .amenity-item {
          background: #f8fafc;
          padding: 0.5rem 0.875rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .owner-profile {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .owner-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        .owner-details .name {
          font-weight: 600;
          color: var(--text-main);
        }
        .owner-details .email {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .view-link {
          font-size: 0.875rem;
          color: var(--primary);
          font-weight: 500;
        }
        .booking-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .booking-item:last-child {
          border-bottom: none;
        }
        .tenant-name {
          font-weight: 500;
          font-size: 0.875rem;
        }
        .booking-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;

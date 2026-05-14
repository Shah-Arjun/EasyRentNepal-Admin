import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle,
  Home,
  Clock,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
          withCredentials: true
        });
        if (data.success) {
          setUserData(data);
        }
      } catch (error) {
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  if (loading) return <div className="p-8">Loading user details...</div>;
  if (!userData) return <div className="p-8">User not found</div>;

  const { user, listedProperties, bookings } = userData;

  return (
    <div className="user-details-page fade-in">
      <div className="mb-6">
        <Link to="/users" className="btn btn-outline">
          <ArrowLeft size={18} />
          Back to Users
        </Link>
      </div>

      <div className="profile-header card">
        <div className="profile-main">
          <div className="avatar-wrapper">
            <img 
              src={user.profileImage?.url || "https://www.flaticon.com/free-icon/user_149071?term=avatar&page=1&position=3&origin=tag&related_id=149071"} 
              alt={user.name} 
              className="profile-avatar"
            />
            {user.isOtpVerified && <CheckCircle className="verified-badge" size={24} />}
          </div>
          <div className="profile-info">
            <h1>{user.name || "Unnamed User"}</h1>
            <div className="roles">
              {user.role.map((r, i) => (
                <span key={i} className="badge badge-info">{r}</span>
              ))}
            </div>
            <div className="meta">
              <span><Mail size={16} /> {user.email}</span>
              {user.phoneNumber && <span><Phone size={16} /> {user.phoneNumber}</span>}
              {user.location && <span><MapPin size={16} /> {user.location.city}, {user.location.district}</span>}
            </div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="label">Joined</span>
            <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="stat-item">
            <span className="label">Listed</span>
            <span className="value">{listedProperties.length} Properties</span>
          </div>
          <div className="stat-item">
            <span className="label">Bookings</span>
            <span className="value">{bookings.length} Made</span>
          </div>
        </div>
      </div>

      <div className="details-grid mt-8">
        <div className="listings-section">
          <div className="card h-full">
            <h3><Home size={20} /> Listed Properties</h3>
            <div className="property-list">
              {listedProperties.length > 0 ? (
                listedProperties.map((prop) => (
                  <div key={prop._id} className="prop-item">
                    <div className="prop-info">
                      <div className="title">{prop.title}</div>
                      <div className="meta">Rs. {prop.price.toLocaleString()} • {prop.status}</div>
                    </div>
                    <Link to={`/properties/${prop._id}`} className="btn btn-outline btn-sm">View</Link>
                  </div>
                ))
              ) : (
                <div className="empty-state">No properties listed by this user.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bookings-section">
          <div className="card h-full">
            <h3><Clock size={20} /> Booking Activity</h3>
            <div className="booking-list">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking._id} className="booking-item">
                    <div className="booking-info">
                      <div className="prop-title">{booking.property?.title}</div>
                      <div className="meta">{new Date(booking.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`status ${booking.status}`}>{booking.status}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">No booking activity found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2.5rem;
        }
        .profile-main {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .avatar-wrapper {
          position: relative;
        }
        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f1f5f9;
        }
        .verified-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: white;
          color: var(--success);
          border-radius: 50%;
        }
        .profile-info h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .profile-info .roles {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .profile-info .meta {
          display: flex;
          gap: 1.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .profile-info .meta span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .profile-stats {
          display: flex;
          gap: 3rem;
        }
        .stat-item {
          text-align: center;
        }
        .stat-item .label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .stat-item .value {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .prop-item, .booking-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .prop-item:last-child, .booking-item:last-child {
          border-bottom: none;
        }
        .prop-info .title, .booking-info .prop-title {
          font-weight: 600;
          font-size: 0.9375rem;
        }
        .prop-info .meta, .booking-info .meta {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default UserDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Home, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  UserCheck 
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card stat-card"
  >
    <div className={`icon-box ${color}`}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
    <style>{`
      .stat-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
      }
      .icon-box {
        width: 56px;
        height: 56px;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
      .stat-info h3 {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-bottom: 0.25rem;
      }
      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .blue { background: #eff6ff; color: #3b82f6; }
      .green { background: #f0fdf4; color: #22c55e; }
      .orange { background: #fff7ed; color: #f97316; }
      .purple { background: #faf5ff; color: #a855f7; }
      .indigo { background: #eef2ff; color: #6366f1; }
      .cyan { background: #ecfeff; color: #06b6d4; }
    `}</style>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          withCredentials: true
        });
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  const statItems = [
    { title: "Total Properties", value: stats?.totalProperties || 0, icon: <Home />, color: "blue", delay: 0.1 },
    { title: "Available Properties", value: stats?.availableProperties || 0, icon: <CheckCircle />, color: "green", delay: 0.2 },
    { title: "Rented Properties", value: stats?.rentedProperties || 0, icon: <Clock />, color: "orange", delay: 0.3 },
    { title: "Sold Properties", value: stats?.soldProperties || 0, icon: <TrendingUp />, color: "purple", delay: 0.4 },
    { title: "Total Users", value: stats?.totalUsers || 0, icon: <Users />, color: "indigo", delay: 0.5 },
    { title: "Active Users", value: stats?.activeUsers || 0, icon: <UserCheck />, color: "cyan", delay: 0.6 },
  ];

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        {statItems.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      <style>{`
        .page-header {
          margin-bottom: 2rem;
        }
        .page-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: var(--text-muted);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .welcome-card {
          padding: 2.5rem;
          background: linear-gradient(to right, #4f46e5, #818cf8);
          color: white;
          text-align: center;
        }
        .welcome-card h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .welcome-card p {
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { admin, loading } = useAuth();

  if (loading) return null;

  if (!admin) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .main-content {
          margin-left: var(--sidebar-width);
          padding: 2rem;
          min-height: 100vh;
          background: #f8fafc;
        }

        .page-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;

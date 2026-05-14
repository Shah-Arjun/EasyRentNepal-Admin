import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { admin, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  if (!admin) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .page-content {
          padding-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;

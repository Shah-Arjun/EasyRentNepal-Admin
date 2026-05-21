import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logoDuplicate.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, admin } = useAuth();

  if (admin) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-box">
            <img src={Logo} alt="EasyRent Logo" className="" />
          </div>

          <h1>EasyRent</h1>

          <p>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />

              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                Login <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 24px;
          background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0e7ff 100%);
          font-family: "Inter", sans-serif;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          z-index: 0;
        }

        .shape-1 {
          width: 320px;
          height: 320px;
          background: #6366f1;
          top: -80px;
          left: -80px;
        }

        .shape-2 {
          width: 260px;
          height: 260px;
          background: #8b5cf6;
          bottom: -80px;
          right: -60px;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 430px;
          padding: 42px 34px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow:
            0 20px 40px rgba(15, 23, 42, 0.08),
            0 10px 20px rgba(99, 102, 241, 0.08);
          animation: fadeUp 0.5s ease;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 34px;
        }

        .logo-box {
          height: 90px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .logo-box img {
          width: 90px;
          height: 90px;
          object-fit: contain;
        }

        .login-header h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .login-header p {
          margin-top: 8px;
          color: #64748b;
          font-size: 0.98rem;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: 0.2s;
        }

        .input-wrapper input {
          width: 100%;
          height: 56px;
          border-radius: 16px;
          border: 1px solid #dbe2ea;
          background: rgba(255,255,255,0.85);
          padding: 0 16px 0 50px;
          font-size: 1rem;
          color: #0f172a;
          transition: all 0.25s ease;
          outline: none;
        }

        .input-wrapper input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.12);
          background: #fff;
        }

        .input-wrapper input:focus + .input-icon {
          color: #6366f1;
        }

        .login-btn {
          margin-top: 8px;
          height: 56px;
          border: none;
          border-radius: 16px;
          background: var(--color-secondary);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.22);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 30px rgba(79, 70, 229, 0.28);
        }

        .login-btn:active {
          transform: scale(0.98);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 22px;
            border-radius: 24px;
          }

          .logo-box {
            width: 78px;
            height: 78px;
          }

          .logo-box img {
            width: 48px;
            height: 48px;
          }

          .login-header h1 {
            font-size: 1.7rem;
          }

          .input-wrapper input {
            height: 52px;
            font-size: 0.95rem;
          }

          .login-btn {
            height: 52px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
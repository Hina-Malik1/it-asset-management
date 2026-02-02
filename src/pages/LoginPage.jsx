import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { login } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{background: 'linear-gradient(135deg, #0B0E14 0%, #1C1F26 100%)'}}>
      <div className="card shadow-lg" style={{width: '440px', border: '1px solid #00FF94'}}>
        <div className="card-body p-5">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center mb-3"
                 style={{
                   width: '80px', 
                   height: '80px',
                   background: 'linear-gradient(135deg, #00FF94, #00CC75)',
                   borderRadius: '50%',
                   boxShadow: '0 0 20px rgba(0, 255, 148, 0.4)'
                 }}>
              <FaShieldAlt size={40} color="#0B0E14" />
            </div>
            <h3 className="fw-bold mb-2" style={{color: '#00FF94'}}>SYSTEM ACCESS</h3>
            <p className="text-muted" style={{fontFamily: 'JetBrains Mono', fontSize: '12px'}}>
              IT ASSET MANAGEMENT PORTAL
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {error && (
    <div className="alert alert-danger mb-3" role="alert">
      {error}
    </div>
  )}
            <div className="mb-3">
              <label className="form-label">EMAIL ADDRESS</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope style={{color: '#00FF94'}} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{borderLeft: 'none'}}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">PASSWORD</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaLock style={{color: '#00FF94'}} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{borderLeft: 'none'}}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">
                  Remember session
                </label>
              </div>
              <a href="#" className="text-decoration-none" style={{color: '#00FF94', fontSize: '13px'}}>
                Reset Access
              </a>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={loading}>
  {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
</button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0" style={{fontSize: '12px'}}>
              Unauthorized access prohibited | Contact IT Admin
            </p>
          </div>

          {/* Status Indicator */}
          <div className="text-center mt-4">
            <div className="d-inline-flex align-items-center">
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#00FF94',
                borderRadius: '50%',
                marginRight: '8px',
                boxShadow: '0 0 10px rgba(0, 255, 148, 0.8)'
              }}></div>
              <span style={{color: '#00FF94', fontSize: '11px', fontFamily: 'JetBrains Mono'}}>
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaTimes, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { getAssets, getEmployees, createAssignment } from '../services/api';

function AssignAssetPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ asset: '', employee: '', assignDate: '', expectedReturn: '', notes: '' });
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [assetsData, employeesData] = await Promise.all([getAssets(), getEmployees()]);
      setAssets(assetsData);
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load data. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableAssets = assets.filter(a => a.status === 'Available');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createAssignment({
        asset: formData.asset,
        employee: formData.employee,
        assignDate: formData.assignDate,
        expectedReturn: formData.expectedReturn || null,
        notes: formData.notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/assets'), 1500);
    } catch (err) {
      setError('Failed to create assignment. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaCheckCircle size={60} style={{ color: '#00FF94', marginBottom: '16px' }} />
          <h4 style={{ color: '#E4E7EB', fontFamily: 'JetBrains Mono' }}>ASSIGNMENT_CONFIRMED</h4>
          <p style={{ color: '#9CA3AF' }}>Asset has been assigned. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark sticky-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>ASSIGN_ASSET</span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft /><span>DASHBOARD</span>
          </button>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: '700px' }}>
        <div className="card">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4" style={{ fontFamily: 'JetBrains Mono', color: '#E4E7EB', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ASSET_ASSIGNMENT
            </h3>

            {loading ? (
              <div className="text-center py-4">
                <span style={{ color: '#00FF94', fontFamily: 'JetBrains Mono' }}>LOADING_DATA...</span>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-danger">{error}</div>}

                {/* ✅ Warning if no available assets */}
                {availableAssets.length === 0 && (
                  <div className="alert alert-warning d-flex align-items-center gap-2">
                    <FaExclamationTriangle />
                    <div>
                      <strong>No available assets.</strong> All assets are currently in use or there are none in the system.
                      <span className="ms-2">
                        <a href="/assets/add" style={{ color: '#F59E0B' }}>Add an asset first →</a>
                      </span>
                    </div>
                  </div>
                )}

                {/* ✅ Warning if no employees */}
                {employees.length === 0 && (
                  <div className="alert alert-warning d-flex align-items-center gap-2">
                    <FaExclamationTriangle />
                    <div>
                      <strong>No employees found.</strong> You need to add employees before assigning assets.
                      <span className="ms-2">
                        <a href="/employees" style={{ color: '#F59E0B' }}>Add an employee first →</a>
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">SELECT ASSET *</label>
                    <select className="form-select" name="asset" value={formData.asset} onChange={handleChange} required disabled={availableAssets.length === 0}>
                      <option value="">CHOOSE_AVAILABLE_ASSET...</option>
                      {availableAssets.map((asset) => (
                        <option key={asset._id} value={asset._id}>{asset.assetName} — {asset.serialNumber}</option>
                      ))}
                    </select>
                    <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                      {availableAssets.length} available asset{availableAssets.length !== 1 ? 's' : ''}
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">SELECT EMPLOYEE *</label>
                    <select className="form-select" name="employee" value={formData.employee} onChange={handleChange} required disabled={employees.length === 0}>
                      <option value="">CHOOSE_EMPLOYEE...</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>{emp.name} — {emp.department}</option>
                      ))}
                    </select>
                    <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                      {employees.length} employee{employees.length !== 1 ? 's' : ''} in system
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">ASSIGNMENT DATE *</label>
                    <input type="date" className="form-control" name="assignDate" value={formData.assignDate} onChange={handleChange} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">EXPECTED RETURN DATE (optional)</label>
                    <input type="date" className="form-control" name="expectedReturn" value={formData.expectedReturn} onChange={handleChange} />
                    <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>Leave blank for permanent assignment</small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">NOTES (optional)</label>
                    <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Additional notes about this assignment..."></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-3">
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                      <FaTimes /><span>CANCEL</span>
                    </button>
                    <button type="submit" disabled={submitting || availableAssets.length === 0 || employees.length === 0} className="btn btn-success d-flex align-items-center gap-2">
                      <FaUserPlus />
                      <span>{submitting ? 'PROCESSING...' : 'CONFIRM_ASSIGNMENT'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="card mt-4" style={{ borderLeft: '3px solid #00FF94' }}>
          <div className="card-body p-3">
            <h6 className="fw-bold mb-2" style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#00FF94' }}>ASSIGNMENT_INFO</h6>
            <ul className="mb-0" style={{ fontSize: '12px', color: '#9CA3AF' }}>
              <li>Asset status will automatically change to "In Use"</li>
              <li>Assignment is logged in the audit trail</li>
              <li>Only "Available" assets can be assigned</li>
              <li>To return an asset, use the Assets List page</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignAssetPage;
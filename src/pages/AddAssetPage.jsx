import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { createAsset } from '../services/api';

function AddAssetPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    status: 'Available',
    condition: 'New',
    warrantyDate: '',   // ✅ now tracked in state
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createAsset(formData);
      setSuccess(true);
      // After 1.5 seconds, go to assets list
      setTimeout(() => navigate('/assets'), 1500);
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to save asset. Please check all fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show success message while redirecting
  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaCheckCircle size={60} style={{ color: '#00FF94', marginBottom: '16px' }} />
          <h4 style={{ color: '#E4E7EB', fontFamily: 'JetBrains Mono' }}>ASSET_SAVED</h4>
          <p style={{ color: '#9CA3AF' }}>Redirecting to asset list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark sticky-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>
            ADD_ASSET
          </span>
          <button onClick={() => navigate('/assets')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft />
            <span>BACK</span>
          </button>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: '800px' }}>
        <div className="card">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4" style={{ fontFamily: 'JetBrains Mono', color: '#E4E7EB', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ASSET_REGISTRATION
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">ASSET NAME *</label>
                  <input type="text" className="form-control" name="assetName" value={formData.assetName} onChange={handleChange} placeholder="e.g., Dell Laptop XPS 15" required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">ASSET TYPE *</label>
                  <select className="form-select" name="assetType" value={formData.assetType} onChange={handleChange} required>
                    <option value="">SELECT_TYPE</option>
                    <option value="Laptop">LAPTOP</option>
                    <option value="Monitor">MONITOR</option>
                    <option value="License">LICENSE</option>
                    <option value="Peripheral">PERIPHERAL</option>
                    <option value="Other">OTHER</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">SERIAL NUMBER *</label>
                  <input type="text" className="form-control" name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="e.g., DL-2024-001" required style={{ fontFamily: 'JetBrains Mono' }} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">PURCHASE DATE *</label>
                  <input type="date" className="form-control" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">PURCHASE PRICE</label>
                  <div className="input-group">
                    <span className="input-group-text">£</span>
                    <input type="number" className="form-control" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} placeholder="0.00" min="0" style={{ borderLeft: 'none' }} />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">STATUS *</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleChange} required>
                    <option value="Available">AVAILABLE</option>
                    <option value="In Use">IN_USE</option>
                    <option value="Damaged">DAMAGED</option>
                    <option value="Maintenance">MAINTENANCE</option>
                    <option value="Retired">RETIRED</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">CONDITION *</label>
                  <select className="form-select" name="condition" value={formData.condition} onChange={handleChange} required>
                    <option value="New">NEW</option>
                    <option value="Good">GOOD</option>
                    <option value="Fair">FAIR</option>
                    <option value="Poor">POOR</option>
                  </select>
                </div>

                {/* ✅ WARRANTY DATE — now properly connected to formData */}
                <div className="col-md-6">
                  <label className="form-label">WARRANTY END DATE</label>
                  <input type="date" className="form-control" name="warrantyDate" value={formData.warrantyDate} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label className="form-label">DESCRIPTION / NOTES</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Additional information about this asset..."></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button type="button" onClick={() => navigate('/assets')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                  <FaTimes />
                  <span>CANCEL</span>
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary d-flex align-items-center gap-2">
                  <FaSave />
                  <span>{submitting ? 'SAVING...' : 'SAVE_ASSET'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAssetPage;
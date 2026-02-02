import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
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
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await createAsset(formData);
    alert('Asset created successfully!');
    navigate('/assets');
  } catch (err) {
    console.error('Error creating asset:', err);
    alert('Error creating asset');
  }
};

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{fontFamily: 'JetBrains Mono', color: '#00FF94'}}>
            ADD_ASSET
          </span>
          <button onClick={() => navigate('/assets')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft />
            <span>BACK</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4" style={{maxWidth: '800px'}}>
        <div className="card">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4" style={{
              fontFamily: 'JetBrains Mono',
              color: '#E4E7EB',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              ASSET_REGISTRATION
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Asset Name */}
                <div className="col-md-6">
                  <label className="form-label">ASSET NAME</label>
                  <input
                    type="text"
                    className="form-control"
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleChange}
                    placeholder="e.g., Dell Laptop XPS 15"
                    required
                  />
                </div>

                {/* Asset Type */}
                <div className="col-md-6">
                  <label className="form-label">ASSET TYPE</label>
                  <select
                    className="form-select"
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">SELECT_TYPE</option>
                    <option value="Laptop">LAPTOP</option>
                    <option value="Monitor">MONITOR</option>
                    <option value="License">LICENSE</option>
                    <option value="Peripheral">PERIPHERAL</option>
                    <option value="Other">OTHER</option>
                  </select>
                </div>

                {/* Serial Number */}
                <div className="col-md-6">
                  <label className="form-label">SERIAL NUMBER</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="e.g., DL-2024-001"
                    required
                    style={{fontFamily: 'JetBrains Mono'}}
                  />
                </div>

                {/* Purchase Date */}
                <div className="col-md-6">
                  <label className="form-label">PURCHASE DATE</label>
                  <input
                    type="date"
                    className="form-control"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Purchase Price */}
                <div className="col-md-6">
                  <label className="form-label">PURCHASE PRICE</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      style={{borderLeft: 'none'}}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label">STATUS</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Available">AVAILABLE</option>
                    <option value="In Use">IN_USE</option>
                    <option value="Damaged">DAMAGED</option>
                    <option value="Maintenance">MAINTENANCE</option>
                    <option value="Retired">RETIRED</option>
                  </select>
                </div>

                {/* Condition */}
                <div className="col-md-6">
                  <label className="form-label">CONDITION</label>
                  <select
                    className="form-select"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="New">NEW</option>
                    <option value="Good">GOOD</option>
                    <option value="Fair">FAIR</option>
                    <option value="Poor">POOR</option>
                  </select>
                </div>

                {/* Warranty End Date */}
                <div className="col-md-6">
                  <label className="form-label">WARRANTY END</label>
                  <input
                    type="date"
                    className="form-control"
                    name="warrantyDate"
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">DESCRIPTION / NOTES</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Additional information about this asset..."
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button type="button" onClick={() => navigate('/assets')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                  <FaTimes />
                  <span>CANCEL</span>
                </button> 
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                  <FaSave />
                  <span>SAVE_ASSET</span>
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { getAssets, getEmployees, createAssignment } from '../services/api';

function AssignAssetPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    asset: '',
    employee: '',
    assignDate: '',
    expectedReturn: '',
    notes: ''
  });

  // These hold the real data from the API for the two dropdown menus
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);       // while fetching dropdown data
  const [submitting, setSubmitting] = useState(false); // while sending the assignment

  // When the page loads, fetch both assets and employees at the same time
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetches both at the same time (faster than one after the other)
      const [assetsData, employeesData] = await Promise.all([
        getAssets(),
        getEmployees()
      ]);
      setAssets(assetsData);
      setEmployees(employeesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter: only show assets that are "Available" in the dropdown
  const availableAssets = assets.filter(a => a.status === 'Available');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // This runs when you click CONFIRM_ASSIGNMENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Send the form data to the backend to create the assignment
      await createAssignment({
        asset: formData.asset,
        employee: formData.employee,
        assignDate: formData.assignDate,
        expectedReturn: formData.expectedReturn || null,
        notes: formData.notes
      });
      alert('Assignment created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert('Failed to create assignment. Check the console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{fontFamily: 'JetBrains Mono', color: '#00FF94'}}>
            ASSIGN_ASSET
          </span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft />
            <span>DASHBOARD</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4" style={{maxWidth: '700px'}}>
        <div className="card">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4" style={{
              fontFamily: 'JetBrains Mono',
              color: '#E4E7EB',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              ASSET_ASSIGNMENT
            </h3>

            {/* If data is still loading, show a message instead of the form */}
            {loading ? (
              <div className="text-center py-4">
                <span style={{color: '#00FF94', fontFamily: 'JetBrains Mono'}}>LOADING_DATA...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Select Asset — populated from real API, only "Available" ones */}
                <div className="mb-4">
                  <label className="form-label">SELECT ASSET</label>
                  <select
                    className="form-select"
                    name="asset"
                    value={formData.asset}
                    onChange={handleChange}
                    required
                  >
                    <option value="">CHOOSE_AVAILABLE_ASSET...</option>
                    {availableAssets.map((asset) => (
                      <option key={asset._id} value={asset._id}>
                        {asset.assetName} ({asset.serialNumber})
                      </option>
                    ))}
                  </select>
                  <small style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px'}}>
                    → Only available assets shown ({availableAssets.length} available)
                  </small>
                </div>

                {/* Select Employee — populated from real API */}
                <div className="mb-4">
                  <label className="form-label">SELECT EMPLOYEE</label>
                  <select
                    className="form-select"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    required
                  >
                    <option value="">CHOOSE_EMPLOYEE...</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment Date */}
                <div className="mb-4">
                  <label className="form-label">ASSIGNMENT DATE</label>
                  <input
                    type="date"
                    className="form-control"
                    name="assignDate"
                    value={formData.assignDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Expected Return Date */}
                <div className="mb-4">
                  <label className="form-label">EXPECTED RETURN (Optional)</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                  />
                  <small style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px'}}>
                    → Leave blank for permanent assignment
                  </small>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="form-label">ASSIGNMENT NOTES</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Additional notes about this assignment..."
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3">
                  <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <FaTimes />
                    <span>CANCEL</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-success d-flex align-items-center gap-2"
                  >
                    <FaUserPlus />
                    <span>{submitting ? 'PROCESSING...' : 'CONFIRM_ASSIGNMENT'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="card mt-4" style={{borderLeft: '3px solid #00FF94'}}>
          <div className="card-body p-3">
            <h6 className="fw-bold mb-2" style={{fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#00FF94'}}>
              ASSIGNMENT_INFO
            </h6>
            <ul className="mb-0" style={{fontSize: '12px', color: '#9CA3AF'}}>
              <li>Asset status will change to "IN_USE"</li>
              <li>Assignment is logged in the audit trail</li>
              <li>Only "Available" assets can be assigned</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignAssetPage;
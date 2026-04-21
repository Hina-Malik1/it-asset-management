import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaSearch, FaUserCircle, FaArrowLeft, FaTimes, FaSave } from 'react-icons/fa';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add employee modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', department: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setForm({ name: '', email: '', department: '', phone: '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError('');
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.department.trim() || !form.phone.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await createEmployee(form);
      closeModal();
      fetchEmployees();
    } catch (err) {
      setFormError('Failed to add employee. Please check all fields and try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee? This cannot be undone.')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete employee. Please try again.');
        console.error(err);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      (emp.name || '').toLowerCase().includes(term) ||
      (emp.email || '').toLowerCase().includes(term) ||
      (emp.department || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark sticky-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>
            EMPLOYEE_MANAGEMENT
          </span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft />
            <span>DASHBOARD</span>
          </button>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: '#E4E7EB' }}>PERSONNEL REGISTRY</h2>
            <p className="mb-0" style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              {'>'} {loading ? '...' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} in system`}
            </p>
          </div>
          {/* ✅ FIXED: this now opens the real add form */}
          <button onClick={openModal} className="btn btn-primary d-flex align-items-center gap-2">
            <FaPlus />
            <span>ADD_EMPLOYEE</span>
          </button>
        </div>

        {/* Search */}
        <div className="card mb-4">
          <div className="card-body p-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><FaSearch style={{ color: '#00FF94' }} /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or department..."
                  style={{ borderLeft: 'none' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="row g-4">
          {loading && (
            <div className="col-12 text-center py-5">
              <span style={{ color: '#00FF94', fontFamily: 'JetBrains Mono' }}>LOADING_PERSONNEL...</span>
            </div>
          )}

          {!loading && employees.length === 0 && (
            <div className="col-12 text-center py-5">
              <FaUserCircle size={60} style={{ color: '#2D3441', marginBottom: '16px' }} />
              <p style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>NO_EMPLOYEES_YET</p>
              <p style={{ color: '#6B7280', fontSize: '13px' }}>Click ADD_EMPLOYEE to add your first employee.</p>
              <button onClick={openModal} className="btn btn-primary mt-2">
                <FaPlus className="me-2" /> ADD_EMPLOYEE
              </button>
            </div>
          )}

          {!loading && employees.length > 0 && filteredEmployees.length === 0 && (
            <div className="col-12 text-center py-5">
              <span style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>NO_MATCH_FOR_SEARCH</span>
            </div>
          )}

          {!loading && filteredEmployees.map((employee) => (
            <div key={employee._id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100">
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <div style={{ width: '80px', height: '80px', background: 'rgba(0, 255, 148, 0.1)', border: '2px solid rgba(0, 255, 148, 0.3)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaUserCircle size={50} style={{ color: '#00FF94' }} />
                    </div>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#E4E7EB' }}>{employee.name}</h5>
                  <p className="mb-2" style={{ color: '#00FF94', fontFamily: 'JetBrains Mono', fontSize: '12px', textTransform: 'uppercase' }}>
                    {employee.department}
                  </p>
                  <p className="small mb-1" style={{ color: '#9CA3AF', fontSize: '11px' }}>{employee.email}</p>
                  {employee.phone && (
                    <p className="small mb-3" style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>{employee.phone}</p>
                  )}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button onClick={() => handleDelete(employee._id)} className="btn btn-sm btn-outline-danger" title="Delete employee">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ADD EMPLOYEE MODAL ── */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: '#1A1F2E', border: '1px solid #2D3441', color: '#E4E7EB' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #2D3441' }}>
                <h5 className="modal-title fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>ADD_EMPLOYEE</h5>
                <button onClick={closeModal} className="btn btn-sm btn-outline-secondary"><FaTimes /></button>
              </div>
              <div className="modal-body p-4">
                {formError && <div className="alert alert-danger py-2">{formError}</div>}

                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>FULL NAME *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. John Smith"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>EMAIL *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. john@company.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>DEPARTMENT *</label>
                  <select
                    className="form-select"
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                  >
                    <option value="">Select department</option>
                    <option>IT</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                    <option>Sales</option>
                    <option>Management</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>PHONE *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 07700 900000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #2D3441' }}>
                <button onClick={closeModal} className="btn btn-outline-secondary">CANCEL</button>
                <button onClick={handleAdd} disabled={saving} className="btn btn-primary d-flex align-items-center gap-2">
                  <FaSave />
                  {saving ? 'SAVING...' : 'ADD_EMPLOYEE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;
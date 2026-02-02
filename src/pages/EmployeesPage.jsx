import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { getEmployees, createEmployee } from '../services/api';

function EmployeesPage() {
  const navigate = useNavigate();

  // State variables — these hold the real data now
  const [employees, setEmployees] = useState([]); // holds the list from the API
  const [loading, setLoading] = useState(true);   // shows "LOADING..." while fetching
  const [searchTerm, setSearchTerm] = useState(''); // holds whatever you type in the search box

  // This runs automatically when the page first loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  // This function talks to your backend and gets all employees
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // This filters the employees list based on what you typed in the search box
  // It checks the name, email, and department all at once
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  });

  // This runs when you click the trash icon on a card
  // It confirms first, then deletes from the database, then refreshes the list
  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      try {
        // We need to add a deleteEmployee function to api.js — but for now
        // we'll use axios directly with the token
        const token = localStorage.getItem('token');
        const axios = require('axios');
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEmployees(); // refresh the list after deleting
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{fontFamily: 'JetBrains Mono', color: '#00FF94'}}>
            EMPLOYEE_MANAGEMENT
          </span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft />
            <span>DASHBOARD</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{color: '#E4E7EB'}}>PERSONNEL REGISTRY</h2>
            <p className="mb-0" style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px'}}>
              {'>'} Employee asset assignment tracking
            </p>
          </div>
          <button onClick={() => alert('Add Employee form - Coming soon!')} className="btn btn-primary d-flex align-items-center gap-2">
            <FaPlus />
            <span>ADD_EMPLOYEE</span>
          </button>
        </div>

        {/* Search */}
        <div className="card mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch style={{color: '#00FF94'}} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email, or department..."
                    style={{borderLeft: 'none'}}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>ALL_DEPARTMENTS</option>
                  <option>IT</option>
                  <option>HR</option>
                  <option>FINANCE</option>
                  <option>MARKETING</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>SORT_BY_NAME</option>
                  <option>SORT_BY_DEPT</option>
                  <option>SORT_BY_ASSETS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="row g-4">

          {/* LOADING STATE — shows while data is being fetched */}
          {loading && (
            <div className="col-12 text-center py-5">
              <span style={{color: '#00FF94', fontFamily: 'JetBrains Mono'}}>LOADING_PERSONNEL...</span>
            </div>
          )}

          {/* EMPTY STATE — shows when there are no employees at all */}
          {!loading && employees.length === 0 && (
            <div className="col-12 text-center py-5">
              <span style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono'}}>NO_PERSONNEL_FOUND</span>
            </div>
          )}

          {/* NO SEARCH RESULTS — shows when search finds nothing */}
          {!loading && employees.length > 0 && filteredEmployees.length === 0 && (
            <div className="col-12 text-center py-5">
              <span style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono'}}>NO_MATCH_FOR_SEARCH</span>
            </div>
          )}

          {/* THE ACTUAL EMPLOYEE CARDS — maps over real data from the API */}
          {!loading && filteredEmployees.map((employee) => (
            <div key={employee._id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100">
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'rgba(0, 255, 148, 0.1)',
                      border: '2px solid rgba(0, 255, 148, 0.3)',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaUserCircle size={50} style={{color: '#00FF94'}} />
                    </div>
                  </div>
                  <h5 className="fw-bold mb-2" style={{color: '#E4E7EB'}}>{employee.name}</h5>
                  <p className="mb-2" style={{
                    color: '#00FF94',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    textTransform: 'uppercase'
                  }}>
                    {employee.department}
                  </p>
                  <p className="small mb-1" style={{color: '#9CA3AF', fontSize: '11px'}}>
                    {employee.email}
                  </p>
                  <p className="small mb-3" style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px'}}>
                    {employee.phone}
                  </p>

                  <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-sm btn-outline-primary">
                      <FaEye />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="btn btn-sm btn-outline-danger">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;
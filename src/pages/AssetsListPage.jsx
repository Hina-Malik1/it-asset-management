import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { getAssets, deleteAsset } from '../services/api';

function AssetsListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this asset?')) {
      try {
        await deleteAsset(id);
        fetchAssets();
      } catch (err) {
        console.error('Error deleting asset:', err);
      }
    }
  };
  const getStatusBadge = (status) => {
  const badges = {
    'Available': 'bg-success',
    'In Use': 'bg-info',
    'Damaged': 'bg-danger',
    'Maintenance': 'bg-warning'
  };
  return badges[status] || 'bg-secondary';
};



  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{fontFamily: 'JetBrains Mono', color: '#00FF94'}}>
            ASSET_MANAGEMENT
          </span>
          <button onClick={() => navigate('/dashboard')}
          className="btn btn-outline-light d-flex align-items-center gap-2">
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
            <h2 className="fw-bold mb-1" style={{color: '#E4E7EB'}}>ASSET REGISTRY</h2>
            <p className="mb-0" style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px'}}>
              {'>'} Total inventory management
            </p>
          </div>
          <button onClick={() => navigate('/assets/add')} className="btn btn-primary d-flex align-items-center gap-2">
            <FaPlus />
            <span>ADD_NEW</span>
          </button>
        </div>

        {/* Search and Filter */}
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
                    placeholder="Search by name or serial..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{borderLeft: 'none'}}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>ALL_STATUS</option>
                  <option>AVAILABLE</option>
                  <option>IN_USE</option>
                  <option>DAMAGED</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>ALL_TYPES</option>
                  <option>LAPTOP</option>
                  <option>MONITOR</option>
                  <option>LICENSE</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="px-4 py-3" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>ASSET_NAME</th>
                    <th className="py-3" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>TYPE</th>
                    <th className="py-3" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>SERIAL_NO</th>
                    <th className="py-3" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>STATUS</th>
                    <th className="py-3" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>ASSIGNED_TO</th>
                    <th className="py-3" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>DATE</th>
                    <th className="py-3 text-end pe-4" style={{fontFamily: 'JetBrains Mono', fontSize: '11px'}}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
  {loading ? (
    <tr>
      <td colSpan="7" className="text-center py-4">
        <span style={{color: '#00FF94'}}>LOADING_ASSETS...</span>
      </td>
    </tr>
  ) : assets.length === 0 ? (
        <tr>
      <td colSpan="7" className="text-center py-4">
        <span style={{color: '#9CA3AF'}}>NO_ASSETS_FOUND</span>
      </td>
    </tr>
  ) : (
    assets.map((asset) => (
      <tr key={asset._id}>
        <td className="px-4 py-3 fw-semibold">{asset.assetName}</td>
        <td className="py-3">
          <span className="badge bg-secondary">
            {asset.assetType}
          </span>
        </td>
        <td className="py-3" style={{fontFamily: 'JetBrains Mono', color: '#9CA3AF'}}>
          {asset.serialNumber}
        </td>
        <td className="py-3">
          <span className={`badge ${getStatusBadge(asset.status)}`}>
            {asset.status}
          </span>
        </td>
        <td className="py-3">{asset.assignedTo?.name || '-'}</td>
        <td className="py-3" style={{color: '#9CA3AF'}}>
          {new Date(asset.purchaseDate).toLocaleDateString()}
        </td>
        <td className="py-3 text-end pe-4">
          <button className="btn btn-sm btn-outline-primary">
            <FaEye />
          </button>
          <button className="btn btn-sm btn-outline-secondary">
            <FaEdit />
          </button>
          <button 
            onClick={() => handleDelete(asset._id)}
            className="btn btn-sm btn-outline-danger">
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </div>
          <div className="card-footer px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <span style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '12px'}}>
                 {loading 
    ? 'LOADING_COUNT...' 
    : `SHOWING 1-${Math.min(5, assets.length)} OF ${assets.length} ENTRIES`
  }
              </span>
              <nav>
                <ul className="pagination mb-0">
                  <li className="page-item disabled">
                    <a className="page-link" href="#">PREV</a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#">NEXT</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetsListPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaArrowLeft } from 'react-icons/fa';
import { getHistory } from '../services/api';

function AssetHistoryPage() {
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);  // holds the real history from the API
  const [loading, setLoading] = useState(true);

  // Fetch history records when the page loads
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistoryData(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Returns the right colour for each action type badge
  const getActionColor = (action) => {
    const colors = {
      'ASSET_CREATED': '#00FF94',
      'ASSET_ASSIGNED': '#3B82F6',
      'ASSET_RETURNED': '#00FF94',
      'STATUS_CHANGED': '#F59E0B',
      'ASSET_UPDATED': '#9CA3AF',
      'ASSET_DELETED': '#FF6B35'
    };
    return colors[action] || '#9CA3AF';
  };

  // Helper: returns the right rgba string for the background of the icon box
  const getActionBg = (action) => {
    const color = getActionColor(action);
    if (color === '#00FF94') return 'rgba(0, 255, 148, 0.1)';
    if (color === '#3B82F6') return 'rgba(59, 130, 246, 0.1)';
    if (color === '#F59E0B') return 'rgba(245, 158, 11, 0.1)';
    if (color === '#FF6B35') return 'rgba(255, 107, 53, 0.1)';
    return 'rgba(156, 163, 175, 0.1)';
  };

  // Formats a date string into a readable format like "30/01/2024"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Formats a date string into just the time like "14:32"
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{fontFamily: 'JetBrains Mono', color: '#00FF94'}}>
            AUDIT_TRAIL
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
        <div className="mb-4">
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-3" style={{color: '#E4E7EB'}}>
            <FaHistory style={{color: '#00FF94'}} />
            SYSTEM ACTIVITY LOG
          </h2>
          <p className="mb-0" style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px'}}>
            {'>'} Complete timeline of all asset operations
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">DATE FROM</label>
                <input type="date" className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">DATE TO</label>
                <input type="date" className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">ACTION TYPE</label>
                <select className="form-select">
                  <option>ALL_ACTIONS</option>
                  <option>ASSET_CREATED</option>
                  <option>ASSET_ASSIGNED</option>
                  <option>ASSET_RETURNED</option>
                  <option>STATUS_CHANGED</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">FILTER BY</label>
                <select className="form-select">
                  <option>ALL_ASSETS</option>
                  <option>LAPTOPS</option>
                  <option>MONITORS</option>
                  <option>LICENSES</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="card-body p-4">

            {/* LOADING STATE */}
            {loading && (
              <div className="text-center py-4">
                <span style={{color: '#00FF94', fontFamily: 'JetBrains Mono'}}>LOADING_HISTORY...</span>
              </div>
            )}

            {/* EMPTY STATE — no history records exist yet */}
            {!loading && historyData.length === 0 && (
              <div className="text-center py-4">
                <span style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono'}}>NO_HISTORY_RECORDS</span>
                <p className="mt-2" style={{color: '#9CA3AF', fontSize: '13px'}}>
                  History will appear here once you start creating or assigning assets.
                </p>
              </div>
            )}

            {/* THE ACTUAL HISTORY TIMELINE — maps over real data from the API */}
            {!loading && historyData.map((item, index) => (
              <div key={item._id} className="d-flex mb-4 pb-4" style={{borderBottom: index !== historyData.length - 1 ? '1px solid #363B47' : 'none'}}>
                {/* Icon box on the left */}
                <div className="flex-shrink-0 me-4">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: getActionBg(item.action),
                    border: `2px solid ${getActionColor(item.action)}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaHistory style={{color: getActionColor(item.action)}} size={20} />
                  </div>
                </div>

                {/* Main content card on the right */}
                <div className="flex-grow-1">
                  <div className="card" style={{background: '#2A2F3A', border: '1px solid #363B47'}}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          {/* Action badge — colour matches the action type */}
                          <span className="badge mb-2" style={{
                            background: getActionColor(item.action),
                            color: '#0B0E14',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                          }}>
                            {item.action}
                          </span>
                          {/* Asset name — uses assetName stored on the history record */}
                          <h6 className="fw-bold mb-1" style={{color: '#E4E7EB'}}>
                            {item.assetName || (item.asset && item.asset.assetName) || 'Unknown Asset'}
                          </h6>
                          {/* Details text */}
                          <p className="mb-0" style={{color: '#9CA3AF', fontSize: '13px'}}>{item.details}</p>
                        </div>
                        {/* Date and time on the right side */}
                        <div className="text-end">
                          <div style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px'}}>
                            {formatDate(item.createdAt)}
                          </div>
                          <div style={{color: '#00FF94', fontFamily: 'JetBrains Mono', fontSize: '11px'}}>
                            {formatTime(item.createdAt)}
                          </div>
                        </div>
                      </div>
                      {/* Who did it */}
                      <div className="pt-2 mt-2" style={{borderTop: '1px solid #363B47'}}>
                        <small style={{color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px'}}>
                          PERFORMED_BY: <strong style={{color: '#00FF94'}}>{item.performedBy}</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetHistoryPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { getHistory } from '../services/api';

function AssetHistoryPage() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Filter state — these actually work now
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL_ACTIONS');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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

  const getActionBg = (action) => {
    const color = getActionColor(action);
    if (color === '#00FF94') return 'rgba(0, 255, 148, 0.1)';
    if (color === '#3B82F6') return 'rgba(59, 130, 246, 0.1)';
    if (color === '#F59E0B') return 'rgba(245, 158, 11, 0.1)';
    if (color === '#FF6B35') return 'rgba(255, 107, 53, 0.1)';
    return 'rgba(156, 163, 175, 0.1)';
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  // ✅ Real filtering logic — all 4 filters actually work now
  const filtered = historyData.filter(item => {
    // Action type filter
    if (actionFilter !== 'ALL_ACTIONS' && item.action !== actionFilter) return false;

    // Search filter — checks asset name and who performed it
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const assetName = (item.assetName || '').toLowerCase();
      const performedBy = (item.performedBy || '').toLowerCase();
      const details = (item.details || '').toLowerCase();
      if (!assetName.includes(term) && !performedBy.includes(term) && !details.includes(term)) return false;
    }

    // Date from filter
    if (dateFrom) {
      const itemDate = new Date(item.createdAt);
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (itemDate < from) return false;
    }

    // Date to filter
    if (dateTo) {
      const itemDate = new Date(item.createdAt);
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (itemDate > to) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setActionFilter('ALL_ACTIONS');
    setDateFrom('');
    setDateTo('');
  };

  const filtersActive = searchTerm || actionFilter !== 'ALL_ACTIONS' || dateFrom || dateTo;

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-dark sticky-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>
            AUDIT_TRAIL
          </span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft />
            <span>DASHBOARD</span>
          </button>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-3" style={{ color: '#E4E7EB' }}>
            <FaHistory style={{ color: '#00FF94' }} />
            SYSTEM ACTIVITY LOG
          </h2>
          <p className="mb-0" style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
            {'>'} {loading ? '...' : `${filtered.length} of ${historyData.length} records shown`}
          </p>
        </div>

        {/* Filters — all actually work now */}
        <div className="card mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              {/* Search box */}
              <div className="col-md-3">
                <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>SEARCH</label>
                <div className="input-group">
                  <span className="input-group-text"><FaSearch style={{ color: '#00FF94' }} /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Asset name, user..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ borderLeft: 'none' }}
                  />
                </div>
              </div>

              {/* Action type dropdown */}
              <div className="col-md-3">
                <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>ACTION TYPE</label>
                <select className="form-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
                  <option value="ALL_ACTIONS">ALL_ACTIONS</option>
                  <option value="ASSET_CREATED">ASSET_CREATED</option>
                  <option value="ASSET_ASSIGNED">ASSET_ASSIGNED</option>
                  <option value="ASSET_RETURNED">ASSET_RETURNED</option>
                  <option value="ASSET_UPDATED">ASSET_UPDATED</option>
                  <option value="ASSET_DELETED">ASSET_DELETED</option>
                  <option value="STATUS_CHANGED">STATUS_CHANGED</option>
                </select>
              </div>

              {/* Date from */}
              <div className="col-md-2">
                <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>DATE FROM</label>
                <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>

              {/* Date to */}
              <div className="col-md-2">
                <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>DATE TO</label>
                <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>

              {/* Clear button — only shows when filters are active */}
              <div className="col-md-2 d-flex align-items-end">
                {filtersActive && (
                  <button onClick={clearFilters} className="btn btn-outline-secondary w-100" style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                    CLEAR_FILTERS
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="card-body p-4">
            {loading && (
              <div className="text-center py-4">
                <span style={{ color: '#00FF94', fontFamily: 'JetBrains Mono' }}>LOADING_HISTORY...</span>
              </div>
            )}

            {!loading && historyData.length === 0 && (
              <div className="text-center py-4">
                <span style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>NO_HISTORY_RECORDS</span>
                <p className="mt-2" style={{ color: '#9CA3AF', fontSize: '13px' }}>
                  History will appear here once you start creating or assigning assets.
                </p>
              </div>
            )}

            {!loading && historyData.length > 0 && filtered.length === 0 && (
              <div className="text-center py-4">
                <span style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>NO_RECORDS_MATCH_FILTERS</span>
                <p className="mt-2" style={{ color: '#9CA3AF', fontSize: '13px' }}>Try adjusting your filters.</p>
                <button onClick={clearFilters} className="btn btn-outline-secondary btn-sm mt-1" style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>CLEAR_FILTERS</button>
              </div>
            )}

            {!loading && filtered.map((item, index) => (
              <div key={item._id} className="d-flex mb-4 pb-4" style={{ borderBottom: index !== filtered.length - 1 ? '1px solid #363B47' : 'none' }}>
                {/* Icon */}
                <div className="flex-shrink-0 me-4">
                  <div style={{ width: '48px', height: '48px', background: getActionBg(item.action), border: `2px solid ${getActionColor(item.action)}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaHistory style={{ color: getActionColor(item.action) }} size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <div className="card" style={{ background: '#2A2F3A', border: '1px solid #363B47' }}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge mb-2" style={{ background: getActionColor(item.action), color: '#0B0E14', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                            {item.action}
                          </span>
                          <h6 className="fw-bold mb-1" style={{ color: '#E4E7EB' }}>
                            {item.assetName || (item.asset && item.asset.assetName) || 'Unknown Asset'}
                          </h6>
                          <p className="mb-0" style={{ color: '#9CA3AF', fontSize: '13px' }}>{item.details}</p>
                        </div>
                        <div className="text-end">
                          <div style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>{formatDate(item.createdAt)}</div>
                          <div style={{ color: '#00FF94', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>{formatTime(item.createdAt)}</div>
                        </div>
                      </div>
                      <div className="pt-2 mt-2" style={{ borderTop: '1px solid #363B47' }}>
                        <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                          PERFORMED_BY: <strong style={{ color: '#00FF94' }}>{item.performedBy}</strong>
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
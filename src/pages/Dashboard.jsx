import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaCheckCircle, FaTools, FaExclamationTriangle, FaPlus, FaUserPlus, FaChartBar, FaBell, FaUser, FaPowerOff } from 'react-icons/fa';
import { getAssets, getHistory } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();

    const [totalAssets, setTotalAssets] = useState(0);
    const [availableCount, setAvailableCount] = useState(0);
    const [inUseCount, setInUseCount] = useState(0);
    const [damagedCount, setDamagedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchAssetCounts();
        fetchRecentActivity();
    }, []);

    const fetchAssetCounts = async () => {
        try {
            const assets = await getAssets();
            setTotalAssets(assets.length);
            setAvailableCount(assets.filter(a => a.status === 'Available').length);
            setInUseCount(assets.filter(a => a.status === 'In Use').length);
            setDamagedCount(assets.filter(a => a.status === 'Damaged').length);
        } catch (err) {
            console.error('Error fetching asset counts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const history = await getHistory();
            setRecentActivities(history.slice(0, 3));
        } catch (err) {
            console.error('Error fetching recent activity:', err);
        }
    };

    const getActivityColor = (action) => {
        if (action === 'ASSET_CREATED' || action === 'ASSET_RETURNED') return '#00FF94';
        if (action === 'ASSET_ASSIGNED') return '#3B82F6';
        if (action === 'ASSET_DELETED') return '#FF6B35';
        return '#F59E0B';
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
                <div className="container-fluid px-4">
                    <span className="navbar-brand mb-0 h1 fw-bold d-flex align-items-center">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #00FF94, #00CC75)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                        }}>
                            <FaBox color="#0B0E14" size={18} />
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>ASSET_CONTROL</span>
                    </span>
                    <div className="d-flex align-items-center gap-3">
                        <button className="btn btn-outline-light position-relative" onClick={() => navigate('/history')}>
                            <FaBell />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: '#FF6B35' }}>3</span>
                        </button>
                        <div className="dropdown">
                            <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                                <FaUser />
                                <span>ADMIN</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); alert('Profile Settings - Coming in Phase 2'); }}>Profile Settings</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); alert('System Config - Coming in Phase 2'); }}>System Config</a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item text-danger d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                                        <FaPowerOff /> Terminate Session
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#E4E7EB' }}>MISSION CONTROL</h2>
                        <p className="mb-0" style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
                            {'>'} System operational | All assets monitored
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div style={{ color: '#9CA3AF', fontSize: '12px', fontFamily: 'JetBrains Mono' }}>
                            LAST_SYNC: <span style={{ color: '#00FF94' }}>LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-xl-3 col-md-6">
                        <div className="card h-100" style={{ borderLeft: '3px solid #00FF94' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <p className="mb-2" style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>TOTAL ASSETS</p>
                                        <h2 className="fw-bold mb-2" style={{ color: '#E4E7EB', fontFamily: 'JetBrains Mono' }}>{loading ? '...' : totalAssets}</h2>
                                        <small style={{ color: '#00FF94', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>LIVE_COUNT</small>
                                    </div>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(0, 255, 148, 0.1)', border: '1px solid rgba(0, 255, 148, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaBox size={24} style={{ color: '#00FF94' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card h-100" style={{ borderLeft: '3px solid #00FF94' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <p className="mb-2" style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>AVAILABLE</p>
                                        <h2 className="fw-bold mb-2" style={{ color: '#00FF94', fontFamily: 'JetBrains Mono' }}>{loading ? '...' : availableCount}</h2>
                                        <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>READY_TO_DEPLOY</small>
                                    </div>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(0, 255, 148, 0.1)', border: '1px solid rgba(0, 255, 148, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaCheckCircle size={24} style={{ color: '#00FF94' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card h-100" style={{ borderLeft: '3px solid #3B82F6' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <p className="mb-2" style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>IN USE</p>
                                        <h2 className="fw-bold mb-2" style={{ color: '#3B82F6', fontFamily: 'JetBrains Mono' }}>{loading ? '...' : inUseCount}</h2>
                                        <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>ASSIGNED_ACTIVE</small>
                                    </div>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaTools size={24} style={{ color: '#3B82F6' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card h-100" style={{ borderLeft: '3px solid #FF6B35' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <p className="mb-2" style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>DAMAGED</p>
                                        <h2 className="fw-bold mb-2" style={{ color: '#FF6B35', fontFamily: 'JetBrains Mono' }}>{loading ? '...' : damagedCount}</h2>
                                        <small style={{ color: '#FF6B35', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>⚠ CRITICAL_ALERT</small>
                                    </div>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaExclamationTriangle size={24} style={{ color: '#FF6B35' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Quick Actions */}
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ fontFamily: 'JetBrains Mono', color: '#E4E7EB', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>QUICK_ACTIONS</h5>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <button onClick={() => navigate('/assets/add')} className="btn btn-primary w-100 py-3 d-flex flex-column align-items-center gap-2">
                                            <FaPlus size={24} />
                                            <span className="fw-semibold" style={{ fontFamily: 'JetBrains Mono' }}>ADD_ASSET</span>
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <button onClick={() => navigate('/assign')} className="btn btn-success w-100 py-3 d-flex flex-column align-items-center gap-2">
                                            <FaUserPlus size={24} />
                                            <span className="fw-semibold" style={{ fontFamily: 'JetBrains Mono' }}>ASSIGN</span>
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <button onClick={() => navigate('/history')} className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center gap-2">
                                            <FaChartBar size={24} />
                                            <span className="fw-semibold" style={{ fontFamily: 'JetBrains Mono' }}>REPORTS</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Asset Distribution */}
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ fontFamily: 'JetBrains Mono', color: '#E4E7EB', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>ASSET_DISTRIBUTION</h5>
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#E4E7EB' }}>LAPTOPS</span>
                                        <span className="fw-semibold" style={{ color: '#00FF94', fontFamily: 'JetBrains Mono' }}>60</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ width: '40%', background: '#00FF94' }}></div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#E4E7EB' }}>MONITORS</span>
                                        <span className="fw-semibold" style={{ color: '#3B82F6', fontFamily: 'JetBrains Mono' }}>45</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ width: '30%', background: '#3B82F6' }}></div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#E4E7EB' }}>LICENSES</span>
                                        <span className="fw-semibold" style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>30</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ width: '20%', background: '#F59E0B' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#E4E7EB' }}>PERIPHERALS</span>
                                        <span className="fw-semibold" style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>15</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ width: '10%', background: '#9CA3AF' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Alerts */}
                        <div className="card mt-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ fontFamily: 'JetBrains Mono', color: '#E4E7EB', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>SYSTEM_ALERTS</h5>
                                <div className="alert alert-warning mb-3" role="alert">
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 'bold' }}>⚠ LOW_STOCK</div>
                                    <small>Only 5 laptops available for deployment</small>
                                </div>
                                <div className="alert alert-danger mb-0" role="alert">
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 'bold' }}>🔧 MAINTENANCE_DUE</div>
                                    <small>10 assets require immediate servicing</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Log — now uses real history data */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ fontFamily: 'JetBrains Mono', color: '#E4E7EB', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>ACTIVITY_LOG</h5>

                                {recentActivities.length === 0 && (
                                    <p style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
                                        No recent activity. Start by adding an asset to see logs here.
                                    </p>
                                )}

                                <div className="list-group list-group-flush">
                                    {recentActivities.map((activity) => (
                                        <div key={activity._id} className="list-group-item px-0 py-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="d-flex gap-3">
                                                    <div style={{ width: '4px', backgroundColor: getActivityColor(activity.action), borderRadius: '2px' }}></div>
                                                    <div>
                                                        <h6 className="fw-semibold mb-1" style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: getActivityColor(activity.action) }}>
                                                            {activity.action}
                                                        </h6>
                                                        <p className="mb-1" style={{ color: '#E4E7EB' }}>{activity.assetName || 'Unknown Asset'}</p>
                                                        <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>by {activity.performedBy}</small>
                                                    </div>
                                                </div>
                                                <small style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>{getTimeAgo(activity.createdAt)}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
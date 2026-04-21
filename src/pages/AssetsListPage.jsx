import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft, FaSave, FaTimes, FaArchive, FaList, FaUndo } from 'react-icons/fa';
import { getAssets, getDeletedAssets, deleteAsset, updateAsset, restoreAsset } from '../services/api';

function AssetsListPage() {
  const navigate = useNavigate();

  // ✅ Two tabs — 'active' or 'previous'
  const [activeTab, setActiveTab] = useState('active');

  const [assets, setAssets] = useState([]);
  const [deletedAssets, setDeletedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL_STATUS');
  const [typeFilter, setTypeFilter] = useState('ALL_TYPES');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edit modal
  const [editingAsset, setEditingAsset] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [active, deleted] = await Promise.all([getAssets(), getDeletedAssets()]);
      setAssets(active);
      setDeletedAssets(deleted);
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this asset? It will be moved to Previous Assets and can still be viewed there.')) {
      try {
        await deleteAsset(id);
        fetchAll();
      } catch (err) {
        alert('Failed to remove asset. Please try again.');
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Restore this asset back to Active Assets?')) {
      try {
        await restoreAsset(id);
        fetchAll();
      } catch (err) {
        alert('Failed to restore asset. Please try again.');
      }
    }
  };

  const openEdit = (asset) => {
    setEditingAsset(asset);
    setEditForm({
      assetName: asset.assetName || '',
      assetType: asset.assetType || '',
      serialNumber: asset.serialNumber || '',
      status: asset.status || 'Available',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : '',
      description: asset.description || '',
    });
    setSaveError('');
  };

  const closeEdit = () => { setEditingAsset(null); setEditForm({}); setSaveError(''); };

  const handleSaveEdit = async () => {
    if (!editForm.assetName || !editForm.serialNumber) {
      setSaveError('Asset Name and Serial Number are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      await updateAsset(editingAsset._id, editForm);
      closeEdit();
      fetchAll();
    } catch (err) {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = { 'Available': 'bg-success', 'In Use': 'bg-info', 'Damaged': 'bg-danger', 'Maintenance': 'bg-warning text-dark', 'Retired': 'bg-secondary' };
    return badges[status] || 'bg-secondary';
  };

  // Which list to show based on tab
  const currentList = activeTab === 'active' ? assets : deletedAssets;

  const filtered = currentList.filter(a => {
    const matchSearch = !searchTerm ||
      (a.assetName && a.assetName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.serialNumber && a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'ALL_STATUS' || a.status === statusFilter;
    const matchType = typeFilter === 'ALL_TYPES' || a.assetType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const uniqueTypes = [...new Set(assets.map(a => a.assetType).filter(Boolean))];

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setStatusFilter('ALL_STATUS');
    setTypeFilter('ALL_TYPES');
  };

  return (
    <div className="min-vh-100">
      {/* Nav */}
      <nav className="navbar navbar-dark sticky-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>ASSET_MANAGEMENT</span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light d-flex align-items-center gap-2">
            <FaArrowLeft /><span>DASHBOARD</span>
          </button>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: '#E4E7EB' }}>ASSET REGISTRY</h2>
            <p className="mb-0" style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              {'>'} {loading ? '...' : `${assets.length} active · ${deletedAssets.length} previous`}
            </p>
          </div>
          {activeTab === 'active' && (
            <button onClick={() => navigate('/assets/add')} className="btn btn-primary d-flex align-items-center gap-2">
              <FaPlus /><span>ADD_NEW</span>
            </button>
          )}
        </div>

        {/* ✅ TABS */}
        <div className="d-flex gap-2 mb-4">
          <button
            onClick={() => switchTab('active')}
            className="btn d-flex align-items-center gap-2"
            style={{
              background: activeTab === 'active' ? '#00FF94' : 'transparent',
              color: activeTab === 'active' ? '#0B0E14' : '#9CA3AF',
              border: `1px solid ${activeTab === 'active' ? '#00FF94' : '#2D3441'}`,
              fontFamily: 'JetBrains Mono',
              fontSize: '13px',
              fontWeight: activeTab === 'active' ? 'bold' : 'normal'
            }}
          >
            <FaList size={13} />
            ACTIVE ASSETS
            <span className="badge ms-1" style={{ background: activeTab === 'active' ? '#0B0E14' : '#2D3441', color: '#00FF94' }}>
              {assets.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('previous')}
            className="btn d-flex align-items-center gap-2"
            style={{
              background: activeTab === 'previous' ? '#FF6B35' : 'transparent',
              color: activeTab === 'previous' ? '#0B0E14' : '#9CA3AF',
              border: `1px solid ${activeTab === 'previous' ? '#FF6B35' : '#2D3441'}`,
              fontFamily: 'JetBrains Mono',
              fontSize: '13px',
              fontWeight: activeTab === 'previous' ? 'bold' : 'normal'
            }}
          >
            <FaArchive size={13} />
            PREVIOUS ASSETS
            <span className="badge ms-1" style={{ background: activeTab === 'previous' ? '#0B0E14' : '#2D3441', color: '#FF6B35' }}>
              {deletedAssets.length}
            </span>
          </button>
        </div>

        {/* Info banner for previous tab */}
        {activeTab === 'previous' && (
          <div className="alert mb-4 d-flex align-items-center gap-2" style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35' }}>
            <FaArchive />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              These are assets that have been removed from the system. They are kept here for your records.
            </span>
          </div>
        )}

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><FaSearch style={{ color: '#00FF94' }} /></span>
                  <input type="text" className="form-control" placeholder="Search by name or serial number..." value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ borderLeft: 'none' }} />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="ALL_STATUS">ALL_STATUS</option>
                  <option value="Available">AVAILABLE</option>
                  <option value="In Use">IN_USE</option>
                  <option value="Damaged">DAMAGED</option>
                  <option value="Maintenance">MAINTENANCE</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="ALL_TYPES">ALL_TYPES</option>
                  {uniqueTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="px-4 py-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>ASSET_NAME</th>
                    <th className="py-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>TYPE</th>
                    <th className="py-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>SERIAL_NO</th>
                    <th className="py-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>STATUS</th>
                    <th className="py-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>ASSIGNED_TO</th>
                    <th className="py-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                      {activeTab === 'previous' ? 'REMOVED_ON' : 'PURCHASE_DATE'}
                    </th>
                    <th className="py-3 text-end pe-4" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-4"><span style={{ color: '#00FF94' }}>LOADING...</span></td></tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <span style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>
                          {activeTab === 'previous' ? 'NO_PREVIOUS_ASSETS — Nothing has been removed yet.' : 'NO_ASSETS_FOUND'}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    paginated.map(asset => (
                      <tr key={asset._id} style={{ opacity: activeTab === 'previous' ? 0.7 : 1 }}>
                        <td className="px-4 py-3 fw-semibold">{asset.assetName}</td>
                        <td className="py-3"><span className="badge bg-secondary">{asset.assetType}</span></td>
                        <td className="py-3" style={{ fontFamily: 'JetBrains Mono', color: '#9CA3AF' }}>{asset.serialNumber}</td>
                        <td className="py-3"><span className={`badge ${getStatusBadge(asset.status)}`}>{asset.status}</span></td>
                        <td className="py-3">{asset.assignedTo?.name || '-'}</td>
                        <td className="py-3" style={{ color: '#9CA3AF' }}>
                          {activeTab === 'previous'
                            ? (asset.deletedAt ? new Date(asset.deletedAt).toLocaleDateString('en-GB') : '-')
                            : (asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString('en-GB') : '-')
                          }
                        </td>
                        {activeTab === 'active' && (
                          <td className="py-3 text-end pe-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button onClick={() => openEdit(asset)} className="btn btn-sm btn-outline-secondary" title="Edit asset"><FaEdit /></button>
                              <button onClick={() => handleDelete(asset._id)} className="btn btn-sm btn-outline-danger" title="Remove asset"><FaTrash /></button>
                            </div>
                          </td>
                        )}
                        {activeTab === 'previous' && (
                          <td className="py-3 text-end pe-4">
                            <button onClick={() => handleRestore(asset._id)} className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" title="Restore asset">
                              <FaUndo size={11} /> RESTORE
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="card-footer px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                SHOWING {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} OF {filtered.length}
              </span>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>PREV</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                    <li key={pg} className={`page-item ${currentPage === pg ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(pg)}>{pg}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>NEXT</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingAsset && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: '#1A1F2E', border: '1px solid #2D3441', color: '#E4E7EB' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #2D3441' }}>
                <h5 className="modal-title fw-bold" style={{ fontFamily: 'JetBrains Mono', color: '#00FF94' }}>EDIT_ASSET</h5>
                <button onClick={closeEdit} className="btn btn-sm btn-outline-secondary"><FaTimes /></button>
              </div>
              <div className="modal-body p-4">
                {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>ASSET_NAME *</label>
                  <input type="text" className="form-control" value={editForm.assetName} onChange={e => setEditForm({ ...editForm, assetName: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>ASSET_TYPE</label>
                  <select className="form-select" value={editForm.assetType} onChange={e => setEditForm({ ...editForm, assetType: e.target.value })}>
                    <option value="">Select type</option>
                    <option>Laptop</option><option>Monitor</option><option>License</option><option>Peripheral</option><option>Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>SERIAL_NUMBER *</label>
                  <input type="text" className="form-control" value={editForm.serialNumber} onChange={e => setEditForm({ ...editForm, serialNumber: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>STATUS</label>
                  <select className="form-select" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>PURCHASE_DATE</label>
                  <input type="date" className="form-control" value={editForm.purchaseDate} onChange={e => setEditForm({ ...editForm, purchaseDate: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#9CA3AF' }}>DESCRIPTION / NOTES</label>
                  <textarea className="form-control" rows="3" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Additional notes about this asset..." />
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #2D3441' }}>
                <button onClick={closeEdit} className="btn btn-outline-secondary">CANCEL</button>
                <button onClick={handleSaveEdit} disabled={saving} className="btn btn-primary d-flex align-items-center gap-2">
                  <FaSave />{saving ? 'SAVING...' : 'SAVE_CHANGES'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetsListPage;
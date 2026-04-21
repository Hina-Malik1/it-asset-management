import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AssetsListPage from './pages/AssetsListPage';
import AddAssetPage from './pages/AddAssetPage';
import EmployeesPage from './pages/EmployeesPage';
import AssignAssetPage from './pages/AssignAssetPage';
import AssetHistoryPage from './pages/AssetHistoryPage';

// ProtectedRoute: if no token, redirect to login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetsListPage /></ProtectedRoute>} />
        <Route path="/assets/add" element={<ProtectedRoute><AddAssetPage /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/assign" element={<ProtectedRoute><AssignAssetPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AssetHistoryPage /></ProtectedRoute>} />
        {/* Catch-all: unknown URLs go back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
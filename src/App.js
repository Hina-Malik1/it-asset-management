import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AssetsListPage from './pages/AssetsListPage';
import AddAssetPage from './pages/AddAssetPage';
import EmployeesPage from './pages/EmployeesPage';
import AssignAssetPage from './pages/AssignAssetPage';
import AssetHistoryPage from './pages/AssetHistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<AssetsListPage />} />
        <Route path="/assets/add" element={<AddAssetPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/assign" element={<AssignAssetPage />} />
        <Route path="/history" element={<AssetHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
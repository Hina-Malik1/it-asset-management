import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ─── AUTH APIs ───────────────────────────────────────────────

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (username, email, password, role) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, email, password, role });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ─── ASSET APIs ──────────────────────────────────────────────

export const getAssets = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/assets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createAsset = async (assetData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/assets`, assetData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateAsset = async (id, assetData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/assets/${id}`, assetData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAsset = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/assets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ─── EMPLOYEE APIs ───────────────────────────────────────────

export const getEmployees = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/employees`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/employees`, employeeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteEmployee = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ─── ASSIGNMENT APIs ─────────────────────────────────────────

// Creates a new assignment (asset → employee)
export const createAssignment = async (assignmentData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/assignments`, assignmentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Gets all assignments
export const getAssignments = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/assignments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Returns an asset (marks assignment as Returned)
export const returnAsset = async (assignmentId) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/assignments/return/${assignmentId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ─── HISTORY APIs ────────────────────────────────────────────

// Gets the full audit trail
export const getHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
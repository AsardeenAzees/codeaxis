import { api } from './api';

// Get all leads
export const getLeads = async (params = {}) => {
  const response = await api.get('/leads', { params });
  return response.data;
};

// Get a single lead by ID
export const getLead = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

// Create a new lead
export const createLead = async (leadData) => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

// Update an existing lead
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/leads/${id}`, leadData);
  return response.data;
};

// Delete a lead
export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

// Get lead statistics
export const getLeadStats = async () => {
  const response = await api.get('/leads/stats');
  return response.data;
};

// Get leads by status
export const getLeadsByStatus = async (status) => {
  const response = await api.get(`/leads/status/${status}`);
  return response.data;
};

// Get leads by source
export const getLeadsBySource = async (source) => {
  const response = await api.get(`/leads/source/${source}`);
  return response.data;
};

// Get leads by priority
export const getLeadsByPriority = async (priority) => {
  const response = await api.get(`/leads/priority/${priority}`);
  return response.data;
};

// Search leads
export const searchLeads = async (query, filters = {}) => {
  const response = await api.get('/leads/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Export leads
export const exportLeads = async (format = 'csv', filters = {}) => {
  const response = await api.get('/leads/export', {
    params: { format, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

// Bulk update leads
export const bulkUpdateLeads = async (leadIds, updates) => {
  const response = await api.patch('/leads/bulk-update', {
    leadIds,
    updates
  });
  return response.data;
};

// Bulk delete leads
export const bulkDeleteLeads = async (leadIds) => {
  const response = await api.delete('/leads/bulk-delete', {
    data: { leadIds }
  });
  return response.data;
};

// Update lead status
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/leads/${id}/status`, { status });
  return response.data;
};

// Update lead priority
export const updateLeadPriority = async (id, priority) => {
  const response = await api.patch(`/leads/${id}/priority`, { priority });
  return response.data;
};

// Assign lead to user
export const assignLead = async (id, userId) => {
  const response = await api.patch(`/leads/${id}/assign`, { userId });
  return response.data;
};

// Add lead note
export const addLeadNote = async (id, note) => {
  const response = await api.post(`/leads/${id}/notes`, note);
  return response.data;
};

// Get lead notes
export const getLeadNotes = async (id) => {
  const response = await api.get(`/leads/${id}/notes`);
  return response.data;
};

// Convert lead to client
export const convertLeadToClient = async (id, clientData) => {
  const response = await api.post(`/leads/${id}/convert`, clientData);
  return response.data;
};

// Get lead timeline
export const getLeadTimeline = async (id) => {
  const response = await api.get(`/leads/${id}/timeline`);
  return response.data;
};

// Send lead follow-up
export const sendLeadFollowUp = async (id, followUpData) => {
  const response = await api.post(`/leads/${id}/follow-up`, followUpData);
  return response.data;
};

// Get lead activities
export const getLeadActivities = async (id) => {
  const response = await api.get(`/leads/${id}/activities`);
  return response.data;
};

// Add lead activity
export const addLeadActivity = async (id, activity) => {
  const response = await api.post(`/leads/${id}/activities`, activity);
  return response.data;
};

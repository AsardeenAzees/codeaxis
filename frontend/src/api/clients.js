import { api } from './api';

// Get all clients
export const getClients = async (params = {}) => {
  const response = await api.get('/clients', { params });
  return response.data;
};

// Get a single client by ID
export const getClient = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

// Create a new client
export const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

// Update an existing client
export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

// Delete a client
export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

// Get clients by status
export const getClientsByStatus = async (status) => {
  const response = await api.get(`/clients/status/${status}`);
  return response.data;
};

// Get clients by type
export const getClientsByType = async (type) => {
  const response = await api.get(`/clients/type/${type}`);
  return response.data;
};

// Get clients by category
export const getClientsByCategory = async (category) => {
  const response = await api.get(`/clients/category/${category}`);
  return response.data;
};

// Search clients
export const searchClients = async (query, filters = {}) => {
  const response = await api.get('/clients/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Filter clients
export const filterClients = async (filters = {}) => {
  const response = await api.get('/clients/filter', { params: filters });
  return response.data;
};

// Sort clients
export const sortClients = async (sortBy = 'newest', sortOrder = 'desc') => {
  const response = await api.get('/clients/sort', {
    params: { sortBy, sortOrder }
  });
  return response.data;
};

// Paginate clients
export const paginateClients = async (page = 1, limit = 10) => {
  const response = await api.get('/clients/paginate', {
    params: { page, limit }
  });
  return response.data;
};

// Get client count
export const getClientCount = async (filters = {}) => {
  const response = await api.get('/clients/count', { params: filters });
  return response.data;
};

// Update client status
export const updateClientStatus = async (id, status) => {
  const response = await api.patch(`/clients/${id}/status`, { status });
  return response.data;
};

// Update client type
export const updateClientType = async (id, type) => {
  const response = await api.patch(`/clients/${id}/type`, { type });
  return response.data;
};

// Add client note
export const addClientNote = async (id, note) => {
  const response = await api.post(`/clients/${id}/notes`, note);
  return response.data;
};

// Get client notes
export const getClientNotes = async (id) => {
  const response = await api.get(`/clients/${id}/notes`);
  return response.data;
};

// Add client attachment
export const addClientAttachment = async (id, attachmentData) => {
  const response = await api.post(`/clients/${id}/attachments`, attachmentData);
  return response.data;
};

// Get client attachments
export const getClientAttachments = async (id) => {
  const response = await api.get(`/clients/${id}/attachments`);
  return response.data;
};

// Delete client attachment
export const deleteClientAttachment = async (id, attachmentId) => {
  const response = await api.delete(`/clients/${id}/attachments/${attachmentId}`);
  return response.data;
};

// Add client tag
export const addClientTag = async (id, tag) => {
  const response = await api.post(`/clients/${id}/tags`, { tag });
  return response.data;
};

// Remove client tag
export const removeClientTag = async (id, tag) => {
  const response = await api.delete(`/clients/${id}/tags/${tag}`);
  return response.data;
};

// Get client tags
export const getClientTags = async (id) => {
  const response = await api.get(`/clients/${id}/tags`);
  return response.data;
};

// Update client custom fields
export const updateClientCustomFields = async (id, customFields) => {
  const response = await api.patch(`/clients/${id}/custom-fields`, customFields);
  return response.data;
};

// Get client custom fields
export const getClientCustomFields = async (id) => {
  const response = await api.get(`/clients/${id}/custom-fields`);
  return response.data;
};

// Get client timeline
export const getClientTimeline = async (id) => {
  const response = await api.get(`/clients/${id}/timeline`);
  return response.data;
};

// Get client activities
export const getClientActivities = async (id) => {
  const response = await api.get(`/clients/${id}/activities`);
  return response.data;
};

// Add client activity
export const addClientActivity = async (id, activity) => {
  const response = await api.post(`/clients/${id}/activities`, activity);
  return response.data;
};

// Get client projects
export const getClientProjects = async (id) => {
  const response = await api.get(`/clients/${id}/projects`);
  return response.data;
};

// Get client payments
export const getClientPayments = async (id) => {
  const response = await api.get(`/clients/${id}/payments`);
  return response.data;
};

// Get client statistics
export const getClientStats = async () => {
  const response = await api.get('/clients/stats');
  return response.data;
};

// Get client analytics
export const getClientAnalytics = async (period = '30d') => {
  const response = await api.get('/clients/analytics', { params: { period } });
  return response.data;
};

// Get client insights
export const getClientInsights = async (period = '30d') => {
  const response = await api.get('/clients/insights', { params: { period } });
  return response.data;
};

// Get client recommendations
export const getClientRecommendations = async (clientId) => {
  const response = await api.get(`/clients/${clientId}/recommendations`);
  return response.data;
};

// Get related clients
export const getRelatedClients = async (clientId, limit = 4) => {
  const response = await api.get(`/clients/${clientId}/related`, { params: { limit } });
  return response.data;
};

// Get similar clients
export const getSimilarClients = async (clientId, limit = 4) => {
  const response = await api.get(`/clients/${clientId}/similar`, { params: { limit } });
  return response.data;
};

// Export clients
export const exportClients = async (format = 'csv', filters = {}) => {
  const response = await api.get('/clients/export', {
    params: { format, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

// Bulk update clients
export const bulkUpdateClients = async (clientIds, updates) => {
  const response = await api.patch('/clients/bulk-update', {
    clientIds,
    updates
  });
  return response.data;
};

// Bulk delete clients
export const bulkDeleteClients = async (clientIds) => {
  const response = await api.delete('/clients/bulk-delete', {
    data: { clientIds }
  });
  return response.data;
};

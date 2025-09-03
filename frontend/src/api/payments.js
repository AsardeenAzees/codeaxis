import { api } from './api';

// Get all payments
export const getPayments = async (params = {}) => {
  const response = await api.get('/payments', { params });
  return response.data;
};

// Get a single payment by ID
export const getPayment = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

// Create a new payment
export const createPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

// Update an existing payment
export const updatePayment = async (id, paymentData) => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data;
};

// Delete a payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

// Get payments by status
export const getPaymentsByStatus = async (status) => {
  const response = await api.get(`/payments/status/${status}`);
  return response.data;
};

// Get payments by type
export const getPaymentsByType = async (type) => {
  const response = await api.get(`/payments/type/${type}`);
  return response.data;
};

// Get payments by project
export const getPaymentsByProject = async (projectId) => {
  const response = await api.get(`/payments/project/${projectId}`);
  return response.data;
};

// Get payments by client
export const getPaymentsByClient = async (clientId) => {
  const response = await api.get(`/payments/client/${clientId}`);
  return response.data;
};

// Search payments
export const searchPayments = async (query, filters = {}) => {
  const response = await api.get('/payments/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Filter payments
export const filterPayments = async (filters = {}) => {
  const response = await api.get('/payments/filter', { params: filters });
  return response.data;
};

// Sort payments
export const sortPayments = async (sortBy = 'newest', sortOrder = 'desc') => {
  const response = await api.get('/payments/sort', {
    params: { sortBy, sortOrder }
  });
  return response.data;
};

// Paginate payments
export const paginatePayments = async (page = 1, limit = 10) => {
  const response = await api.get('/payments/paginate', {
    params: { page, limit }
  });
  return response.data;
};

// Get payment count
export const getPaymentCount = async (filters = {}) => {
  const response = await api.get('/payments/count', { params: filters });
  return response.data;
};

// Update payment status
export const updatePaymentStatus = async (id, status) => {
  const response = await api.patch(`/payments/${id}/status`, { status });
  return response.data;
};

// Update payment type
export const updatePaymentType = async (id, type) => {
  const response = await api.patch(`/payments/${id}/type`, { type });
  return response.data;
};

// Add payment note
export const addPaymentNote = async (id, note) => {
  const response = await api.post(`/payments/${id}/notes`, note);
  return response.data;
};

// Get payment notes
export const getPaymentNotes = async (id) => {
  const response = await api.get(`/payments/${id}/notes`);
  return response.data;
};

// Add payment attachment
export const addPaymentAttachment = async (id, attachmentData) => {
  const response = await api.post(`/payments/${id}/attachments`, attachmentData);
  return response.data;
};

// Get payment attachments
export const getPaymentAttachments = async (id) => {
  const response = await api.get(`/payments/${id}/attachments`);
  return response.data;
};

// Delete payment attachment
export const deletePaymentAttachment = async (id, attachmentId) => {
  const response = await api.delete(`/payments/${id}/attachments/${attachmentId}`);
  return response.data;
};

// Generate payment invoice
export const generatePaymentInvoice = async (id) => {
  const response = await api.post(`/payments/${id}/invoice`);
  return response.data;
};

// Generate payment receipt
export const generatePaymentReceipt = async (id) => {
  const response = await api.post(`/payments/${id}/receipt`);
  return response.data;
};

// Send payment invoice
export const sendPaymentInvoice = async (id, emailData) => {
  const response = await api.post(`/payments/${id}/send-invoice`, emailData);
  return response.data;
};

// Send payment receipt
export const sendPaymentReceipt = async (id, emailData) => {
  const response = await api.post(`/payments/${id}/send-receipt`, emailData);
  return response.data;
};

// Get payment invoice
export const getPaymentInvoice = async (id) => {
  const response = await api.get(`/payments/${id}/invoice`);
  return response.data;
};

// Get payment receipt
export const getPaymentReceipt = async (id) => {
  const response = await api.get(`/payments/${id}/receipt`);
  return response.data;
};

// Download payment invoice
export const downloadPaymentInvoice = async (id, format = 'pdf') => {
  const response = await api.get(`/payments/${id}/invoice/download`, {
    params: { format },
    responseType: 'blob'
  });
  return response.data;
};

// Download payment receipt
export const downloadPaymentReceipt = async (id, format = 'pdf') => {
  const response = await api.get(`/payments/${id}/receipt/download`, {
    params: { format },
    responseType: 'blob'
  });
  return response.data;
};

// Get payment statistics
export const getPaymentStats = async () => {
  const response = await api.get('/payments/stats');
  return response.data;
};

// Get payment analytics
export const getPaymentAnalytics = async (period = '30d') => {
  const response = await api.get('/payments/analytics', { params: { period } });
  return response.data;
};

// Get payment insights
export const getPaymentInsights = async (period = '30d') => {
  const response = await api.get('/payments/insights', { params: { period } });
  return response.data;
};

// Get payment recommendations
export const getPaymentRecommendations = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}/recommendations`);
  return response.data;
};

// Get related payments
export const getRelatedPayments = async (paymentId, limit = 4) => {
  const response = await api.get(`/payments/${paymentId}/related`, { params: { limit } });
  return response.data;
};

// Get similar payments
export const getSimilarPayments = async (paymentId, limit = 4) => {
  const response = await api.get(`/payments/${paymentId}/similar`, { params: { limit } });
  return response.data;
};

// Export payments
export const exportPayments = async (format = 'csv', filters = {}) => {
  const response = await api.get('/payments/export', {
    params: { format, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

// Bulk update payments
export const bulkUpdatePayments = async (paymentIds, updates) => {
  const response = await api.patch('/payments/bulk-update', {
    paymentIds,
    updates
  });
  return response.data;
};

// Bulk delete payments
export const bulkDeletePayments = async (paymentIds) => {
  const response = await api.delete('/payments/bulk-delete', {
    data: { paymentIds }
  });
  return response.data;
};

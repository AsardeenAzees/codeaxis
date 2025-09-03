import { api } from './api';

// Get all users
export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Get a single user by ID
export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Create a new user
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// Update an existing user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Delete a user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update current user profile
export const updateCurrentUser = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.patch('/users/change-password', passwordData);
  return response.data;
};

// Update user avatar
export const updateUserAvatar = async (avatarData) => {
  const response = await api.patch('/users/avatar', avatarData);
  return response.data;
};

// Get users by role
export const getUsersByRole = async (role) => {
  const response = await api.get(`/users/role/${role}`);
  return response.data;
};

// Get users by status
export const getUsersByStatus = async (status) => {
  const response = await api.get(`/users/status/${status}`);
  return response.data;
};

// Get users by permission
export const getUsersByPermission = async (permission) => {
  const response = await api.get(`/users/permission/${permission}`);
  return response.data;
};

// Search users
export const searchUsers = async (query, filters = {}) => {
  const response = await api.get('/users/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Update user status
export const updateUserStatus = async (id, status) => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};

// Update user role
export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
};

// Update user permissions
export const updateUserPermissions = async (id, permissions) => {
  const response = await api.patch(`/users/${id}/permissions`, { permissions });
  return response.data;
};

// Activate user account
export const activateUser = async (id) => {
  const response = await api.patch(`/users/${id}/activate`);
  return response.data;
};

// Deactivate user account
export const deactivateUser = async (id) => {
  const response = await api.patch(`/users/${id}/deactivate`);
  return response.data;
};

// Suspend user account
export const suspendUser = async (id, reason) => {
  const response = await api.patch(`/users/${id}/suspend`, { reason });
  return response.data;
};

// Unsuspend user account
export const unsuspendUser = async (id) => {
  const response = await api.patch(`/users/${id}/unsuspend`);
  return response.data;
};

// Lock user account
export const lockUser = async (id, reason) => {
  const response = await api.patch(`/users/${id}/lock`, { reason });
  return response.data;
};

// Unlock user account
export const unlockUser = async (id) => {
  const response = await api.patch(`/users/${id}/unlock`);
  return response.data;
};

// Force password change
export const forcePasswordChange = async (id) => {
  const response = await api.patch(`/users/${id}/force-password-change`);
  return response.data;
};

// Reset user password
export const resetUserPassword = async (id, newPassword) => {
  const response = await api.patch(`/users/${id}/reset-password`, { newPassword });
  return response.data;
};

// Verify user email
export const verifyUserEmail = async (id) => {
  const response = await api.patch(`/users/${id}/verify-email`);
  return response.data;
};

// Verify user phone
export const verifyUserPhone = async (id) => {
  const response = await api.patch(`/users/${id}/verify-phone`);
  return response.data;
};

// Resend email verification
export const resendEmailVerification = async (id) => {
  const response = await api.post(`/users/${id}/resend-email-verification`);
  return response.data;
};

// Resend phone verification
export const resendPhoneVerification = async (id) => {
  const response = await api.post(`/users/${id}/resend-phone-verification`);
  return response.data;
};

// Enable two-factor authentication
export const enableTwoFactor = async (id) => {
  const response = await api.patch(`/users/${id}/enable-2fa`);
  return response.data;
};

// Disable two-factor authentication
export const disableTwoFactor = async (id) => {
  const response = await api.patch(`/users/${id}/disable-2fa`);
  return response.data;
};

// Get user sessions
export const getUserSessions = async (id) => {
  const response = await api.get(`/users/${id}/sessions`);
  return response.data;
};

// Revoke user session
export const revokeUserSession = async (id, sessionId) => {
  const response = await api.delete(`/users/${id}/sessions/${sessionId}`);
  return response.data;
};

// Revoke all user sessions
export const revokeAllUserSessions = async (id) => {
  const response = await api.delete(`/users/${id}/sessions`);
  return response.data;
};

// Get user login history
export const getUserLoginHistory = async (id) => {
  const response = await api.get(`/users/${id}/login-history`);
  return response.data;
};

// Get user activity log
export const getUserActivityLog = async (id) => {
  const response = await api.get(`/users/${id}/activity-log`);
  return response.data;
};

// Get user audit log
export const getUserAuditLog = async (id) => {
  const response = await api.get(`/users/${id}/audit-log`);
  return response.data;
};

// Get user change history
export const getUserChangeHistory = async (id) => {
  const response = await api.get(`/users/${id}/change-history`);
  return response.data;
};

// Get user version history
export const getUserVersionHistory = async (id) => {
  const response = await api.get(`/users/${id}/version-history`);
  return response.data;
};

// Restore user version
export const restoreUserVersion = async (id, versionId) => {
  const response = await api.post(`/users/${id}/restore-version`, { versionId });
  return response.data;
};

// Get user backup
export const getUserBackup = async (id) => {
  const response = await api.get(`/users/${id}/backup`);
  return response.data;
};

// Restore user from backup
export const restoreUserFromBackup = async (id, backupId) => {
  const response = await api.post(`/users/${id}/restore-backup`, { backupId });
  return response.data;
};

// Get user custom fields
export const getUserCustomFields = async (id) => {
  const response = await api.get(`/users/${id}/custom-fields`);
  return response.data;
};

// Update user custom fields
export const updateUserCustomFields = async (id, customFields) => {
  const response = await api.patch(`/users/${id}/custom-fields`, customFields);
  return response.data;
};

// Get user statistics
export const getUserStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};

// Get user analytics
export const getUserAnalytics = async (period = '30d') => {
  const response = await api.get('/users/analytics', { params: { period } });
  return response.data;
};

// Get user insights
export const getUserInsights = async (period = '30d') => {
  const response = await api.get('/users/insights', { params: { period } });
  return response.data;
};

// Get user recommendations
export const getUserRecommendations = async (userId) => {
  const response = await api.get(`/users/${userId}/recommendations`);
  return response.data;
};

// Get user suggestions
export const getUserSuggestions = async (query) => {
  const response = await api.get('/users/suggestions', { params: { query } });
  return response.data;
};

// Get user autocomplete
export const getUserAutocomplete = async (query) => {
  const response = await api.get('/users/autocomplete', { params: { query } });
  return response.data;
};

// Export users
export const exportUsers = async (format = 'csv', filters = {}) => {
  const response = await api.get('/users/export', {
    params: { format, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

// Bulk update users
export const bulkUpdateUsers = async (userIds, updates) => {
  const response = await api.patch('/users/bulk-update', {
    userIds,
    updates
  });
  return response.data;
};

// Bulk delete users
export const bulkDeleteUsers = async (userIds) => {
  const response = await api.delete('/users/bulk-delete', {
    data: { userIds }
  });
  return response.data;
};

// Get users by email
export const getUsersByEmail = async (email) => {
  const response = await api.get(`/users/email/${email}`);
  return response.data;
};

// Get users by username
export const getUsersByUsername = async (username) => {
  const response = await api.get(`/users/username/${username}`);
  return response.data;
};

// Get users by phone
export const getUsersByPhone = async (phone) => {
  const response = await api.get(`/users/phone/${phone}`);
  return response.data;
};

// Get users by date range
export const getUsersByDateRange = async (startDate, endDate) => {
  const response = await api.get('/users/date-range', {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get users by month
export const getUsersByMonth = async (year, month) => {
  const response = await api.get(`/users/month/${year}/${month}`);
  return response.data;
};

// Get users by year
export const getUsersByYear = async (year) => {
  const response = await api.get(`/users/year/${year}`);
  return response.data;
};

// Get users by quarter
export const getUsersByQuarter = async (year, quarter) => {
  const response = await api.get(`/users/quarter/${year}/${quarter}`);
  return response.data;
};

// Get users by week
export const getUsersByWeek = async (year, week) => {
  const response = await api.get(`/users/week/${year}/${week}`);
  return response.data;
};

// Get users by day
export const getUsersByDay = async (year, month, day) => {
  const response = await api.get(`/users/day/${year}/${month}/${day}`);
  return response.data;
};

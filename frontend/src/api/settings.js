import { api } from './api';

// Get all settings
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

// Get a single setting by key
export const getSetting = async (key) => {
  const response = await api.get(`/settings/${key}`);
  return response.data;
};

// Update a setting
export const updateSetting = async (key, value) => {
  const response = await api.patch(`/settings/${key}`, { value });
  return response.data;
};

// Update multiple settings
export const updateSettings = async (settings) => {
  const response = await api.patch('/settings', settings);
  return response.data;
};

// Get company information
export const getCompanyInfo = async () => {
  const response = await api.get('/settings/company');
  return response.data;
};

// Update company information
export const updateCompanyInfo = async (companyData) => {
  const response = await api.patch('/settings/company', companyData);
  return response.data;
};

// Get company contact information
export const getCompanyContact = async () => {
  const response = await api.get('/settings/company/contact');
  return response.data;
};

// Update company contact information
export const updateCompanyContact = async (contactData) => {
  const response = await api.patch('/settings/company/contact', contactData);
  return response.data;
};

// Get company social media
export const getCompanySocialMedia = async () => {
  const response = await api.get('/settings/company/social-media');
  return response.data;
};

// Update company social media
export const updateCompanySocialMedia = async (socialMediaData) => {
  const response = await api.patch('/settings/company/social-media', socialMediaData);
  return response.data;
};

// Get company business hours
export const getCompanyBusinessHours = async () => {
  const response = await api.get('/settings/company/business-hours');
  return response.data;
};

// Update company business hours
export const updateCompanyBusinessHours = async (businessHoursData) => {
  const response = await api.patch('/settings/company/business-hours', businessHoursData);
  return response.data;
};

// Get company location
export const getCompanyLocation = async () => {
  const response = await api.get('/settings/company/location');
  return response.data;
};

// Update company location
export const updateCompanyLocation = async (locationData) => {
  const response = await api.patch('/settings/company/location', locationData);
  return response.data;
};

// Get company about
export const getCompanyAbout = async () => {
  const response = await api.get('/settings/company/about');
  return response.data;
};

// Update company about
export const updateCompanyAbout = async (aboutData) => {
  const response = await api.patch('/settings/company/about', aboutData);
  return response.data;
};

// Get company team
export const getCompanyTeam = async () => {
  const response = await api.get('/settings/company/team');
  return response.data;
};

// Update company team
export const updateCompanyTeam = async (teamData) => {
  const response = await api.patch('/settings/company/team', teamData);
  return response.data;
};

// Get company services
export const getCompanyServices = async () => {
  const response = await api.get('/settings/company/services');
  return response.data;
};

// Update company services
export const updateCompanyServices = async (servicesData) => {
  const response = await api.patch('/settings/company/services', servicesData);
  return response.data;
};

// Get project configuration
export const getProjectConfiguration = async () => {
  const response = await api.get('/settings/projects');
  return response.data;
};

// Update project configuration
export const updateProjectConfiguration = async (projectConfig) => {
  const response = await api.patch('/settings/projects', projectConfig);
  return response.data;
};

// Get project statuses
export const getProjectStatuses = async () => {
  const response = await api.get('/settings/projects/statuses');
  return response.data;
};

// Update project statuses
export const updateProjectStatuses = async (statuses) => {
  const response = await api.patch('/settings/projects/statuses', { statuses });
  return response.data;
};

// Get project categories
export const getProjectCategories = async () => {
  const response = await api.get('/settings/projects/categories');
  return response.data;
};

// Update project categories
export const updateProjectCategories = async (categories) => {
  const response = await api.patch('/settings/projects/categories', { categories });
  return response.data;
};

// Get project tech stacks
export const getProjectTechStacks = async () => {
  const response = await api.get('/settings/projects/tech-stacks');
  return response.data;
};

// Update project tech stacks
export const updateProjectTechStacks = async (techStacks) => {
  const response = await api.patch('/settings/projects/tech-stacks', { techStacks });
  return response.data;
};

// Get payment configuration
export const getPaymentConfiguration = async () => {
  const response = await api.get('/settings/payments');
  return response.data;
};

// Update payment configuration
export const updatePaymentConfiguration = async (paymentConfig) => {
  const response = await api.patch('/settings/payments', paymentConfig);
  return response.data;
};

// Get payment methods
export const getPaymentMethods = async () => {
  const response = await api.get('/settings/payments/methods');
  return response.data;
};

// Update payment methods
export const updatePaymentMethods = async (methods) => {
  const response = await api.patch('/settings/payments/methods', { methods });
  return response.data;
};

// Get payment types
export const getPaymentTypes = async () => {
  const response = await api.get('/settings/payments/types');
  return response.data;
};

// Update payment types
export const updatePaymentTypes = async (types) => {
  const response = await api.patch('/settings/payments/types', { types });
  return response.data;
};

// Get email configuration
export const getEmailConfiguration = async () => {
  const response = await api.get('/settings/email');
  return response.data;
};

// Update email configuration
export const updateEmailConfiguration = async (emailConfig) => {
  const response = await api.patch('/settings/email', emailConfig);
  return response.data;
};

// Get email templates
export const getEmailTemplates = async () => {
  const response = await api.get('/settings/email/templates');
  return response.data;
};

// Update email templates
export const updateEmailTemplates = async (templates) => {
  const response = await api.patch('/settings/email/templates', { templates });
  return response.data;
};

// Get notification configuration
export const getNotificationConfiguration = async () => {
  const response = await api.get('/settings/notifications');
  return response.data;
};

// Update notification configuration
export const updateNotificationConfiguration = async (notificationConfig) => {
  const response = await api.patch('/settings/notifications', notificationConfig);
  return response.data;
};

// Get security configuration
export const getSecurityConfiguration = async () => {
  const response = await api.get('/settings/security');
  return response.data;
};

// Update security configuration
export const updateSecurityConfiguration = async (securityConfig) => {
  const response = await api.patch('/settings/security', securityConfig);
  return response.data;
};

// Get backup configuration
export const getBackupConfiguration = async () => {
  const response = await api.get('/settings/backup');
  return response.data;
};

// Update backup configuration
export const updateBackupConfiguration = async (backupConfig) => {
  const response = await api.patch('/settings/backup', backupConfig);
  return response.data;
};

// Get system configuration
export const getSystemConfiguration = async () => {
  const response = await api.get('/settings/system');
  return response.data;
};

// Update system configuration
export const updateSystemConfiguration = async (systemConfig) => {
  const response = await api.patch('/settings/system', systemConfig);
  return response.data;
};

// Get user preferences
export const getUserPreferences = async () => {
  const response = await api.get('/settings/user/preferences');
  return response.data;
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  const response = await api.patch('/settings/user/preferences', preferences);
  return response.data;
};

// Get user settings
export const getUserSettings = async () => {
  const response = await api.get('/settings/user');
  return response.data;
};

// Update user settings
export const updateUserSettings = async (userSettings) => {
  const response = await api.patch('/settings/user', userSettings);
  return response.data;
};

// Reset settings to default
export const resetSettingsToDefault = async () => {
  const response = await api.post('/settings/reset');
  return response.data;
};

// Export settings
export const exportSettings = async (format = 'json') => {
  const response = await api.get('/settings/export', {
    params: { format },
    responseType: 'blob'
  });
  return response.data;
};

// Import settings
export const importSettings = async (settingsData) => {
  const response = await api.post('/settings/import', settingsData);
  return response.data;
};

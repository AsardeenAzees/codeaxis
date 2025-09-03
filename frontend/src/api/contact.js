import { api } from './api';

// Submit general contact form
export const submitContactForm = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};

// Submit project request form
export const submitProjectRequest = async (formData) => {
  const response = await api.post('/contact/project-request', formData);
  return response.data;
};

// Submit general inquiry
export const submitGeneralInquiry = async (formData) => {
  const response = await api.post('/contact/inquiry', formData);
  return response.data;
};

// Submit support request
export const submitSupportRequest = async (formData) => {
  const response = await api.post('/contact/support', formData);
  return response.data;
};

// Submit partnership request
export const submitPartnershipRequest = async (formData) => {
  const response = await api.post('/contact/partnership', formData);
  return response.data;
};

// Submit job application
export const submitJobApplication = async (formData) => {
  const response = await api.post('/contact/job-application', formData);
  return response.data;
};

// Submit feedback
export const submitFeedback = async (formData) => {
  const response = await api.post('/contact/feedback', formData);
  return response.data;
};

// Submit bug report
export const submitBugReport = async (formData) => {
  const response = await api.post('/contact/bug-report', formData);
  return response.data;
};

// Submit feature request
export const submitFeatureRequest = async (formData) => {
  const response = await api.post('/contact/feature-request', formData);
  return response.data;
};

// Submit testimonial
export const submitTestimonial = async (formData) => {
  const response = await api.post('/contact/testimonial', formData);
  return response.data;
};

// Submit review
export const submitReview = async (formData) => {
  const response = await api.post('/contact/review', formData);
  return response.data;
};

// Submit comment
export const submitComment = async (formData) => {
  const response = await api.post('/contact/comment', formData);
  return response.data;
};

// Submit rating
export const submitRating = async (formData) => {
  const response = await api.post('/contact/rating', formData);
  return response.data;
};

// Subscribe to newsletter
export const subscribeNewsletter = async (emailData) => {
  const response = await api.post('/contact/newsletter/subscribe', emailData);
  return response.data;
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (emailData) => {
  const response = await api.post('/contact/newsletter/unsubscribe', emailData);
  return response.data;
};

// Update newsletter preferences
export const updateNewsletterPreferences = async (preferences) => {
  const response = await api.patch('/contact/newsletter/preferences', preferences);
  return response.data;
};

// Submit survey
export const submitSurvey = async (formData) => {
  const response = await api.post('/contact/survey', formData);
  return response.data;
};

// Submit poll
export const submitPoll = async (formData) => {
  const response = await api.post('/contact/poll', formData);
  return response.data;
};

// Submit contest entry
export const submitContestEntry = async (formData) => {
  const response = await api.post('/contact/contest', formData);
  return response.data;
};

// Submit event registration
export const submitEventRegistration = async (formData) => {
  const response = await api.post('/contact/event', formData);
  return response.data;
};

// Submit webinar registration
export const submitWebinarRegistration = async (formData) => {
  const response = await api.post('/contact/webinar', formData);
  return response.data;
};

// Submit workshop registration
export const submitWorkshopRegistration = async (formData) => {
  const response = await api.post('/contact/workshop', formData);
  return response.data;
};

// Submit training registration
export const submitTrainingRegistration = async (formData) => {
  const response = await api.post('/contact/training', formData);
  return response.data;
};

// Submit consultation request
export const submitConsultationRequest = async (formData) => {
  const response = await api.post('/contact/consultation', formData);
  return response.data;
};

// Submit quote request
export const submitQuoteRequest = async (formData) => {
  const response = await api.post('/contact/quote', formData);
  return response.data;
};

// Submit custom request
export const submitCustomRequest = async (formData) => {
  const response = await api.post('/contact/custom', formData);
  return response.data;
};

// Get contact form fields
export const getContactFormFields = async (formType) => {
  const response = await api.get(`/contact/fields/${formType}`);
  return response.data;
};

// Get contact form validation rules
export const getContactFormValidationRules = async (formType) => {
  const response = await api.get(`/contact/validation/${formType}`);
  return response.data;
};

// Get contact form options
export const getContactFormOptions = async (formType) => {
  const response = await api.get(`/contact/options/${formType}`);
  return response.data;
};

// Get contact form templates
export const getContactFormTemplates = async (formType) => {
  const response = await api.get(`/contact/templates/${formType}`);
  return response.data;
};

// Get contact form settings
export const getContactFormSettings = async (formType) => {
  const response = await api.get(`/contact/settings/${formType}`);
  return response.data;
};

// Get contact form analytics
export const getContactFormAnalytics = async (formType, period = '30d') => {
  const response = await api.get(`/contact/analytics/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary
export const getContactFormSummary = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form trends
export const getContactFormTrends = async (formType, period = '12m') => {
  const response = await api.get(`/contact/trends/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form reports
export const getContactFormReports = async (formType, reportType, params = {}) => {
  const response = await api.get(`/contact/reports/${formType}/${reportType}`, {
    params
  });
  return response.data;
};

// Get contact form dashboard
export const getContactFormDashboard = async (formType) => {
  const response = await api.get(`/contact/dashboard/${formType}`);
  return response.data;
};

// Get contact form insights
export const getContactFormInsights = async (formType, period = '30d') => {
  const response = await api.get(`/contact/insights/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form recommendations
export const getContactFormRecommendations = async (formType) => {
  const response = await api.get(`/contact/recommendations/${formType}`);
  return response.data;
};

// Get contact form suggestions
export const getContactFormSuggestions = async (formType, query) => {
  const response = await api.get(`/contact/suggestions/${formType}`, {
    params: { query }
  });
  return response.data;
};

// Get contact form autocomplete
export const getContactFormAutocomplete = async (formType, query) => {
  const response = await api.get(`/contact/autocomplete/${formType}`, {
    params: { query }
  });
  return response.data;
};

// Get contact form search
export const getContactFormSearch = async (formType, query, filters = {}) => {
  const response = await api.get(`/contact/search/${formType}`, {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Get contact form advanced search
export const getContactFormAdvancedSearch = async (formType, searchCriteria) => {
  const response = await api.post(`/contact/advanced-search/${formType}`, searchCriteria);
  return response.data;
};

// Get contact form filter
export const getContactFormFilter = async (formType, filters) => {
  const response = await api.post(`/contact/filter/${formType}`, filters);
  return response.data;
};

// Get contact form sort
export const getContactFormSort = async (formType, sortBy, sortOrder = 'asc') => {
  const response = await api.get(`/contact/sort/${formType}`, {
    params: { sortBy, sortOrder }
  });
  return response.data;
};

// Get contact form paginate
export const getContactFormPaginate = async (formType, page = 1, limit = 10) => {
  const response = await api.get(`/contact/paginate/${formType}`, {
    params: { page, limit }
  });
  return response.data;
};

// Get contact form count
export const getContactFormCount = async (formType, params = {}) => {
  const response = await api.get(`/contact/count/${formType}`, { params });
  return response.data;
};

// Get contact form summary by date
export const getContactFormSummaryByDate = async (formType, startDate, endDate) => {
  const response = await api.get(`/contact/summary-by-date/${formType}`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get contact form summary by user
export const getContactFormSummaryByUser = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-user/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary by source
export const getContactFormSummaryBySource = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-source/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary by status
export const getContactFormSummaryByStatus = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-status/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary by priority
export const getContactFormSummaryByPriority = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-priority/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary by type
export const getContactFormSummaryByType = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-type/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary by category
export const getContactFormSummaryByCategory = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-category/${formType}`, {
    params: { period }
  });
  return response.data;
};

// Get contact form summary by tag
export const getContactFormSummaryByTag = async (formType, period = '30d') => {
  const response = await api.get(`/contact/summary-by-tag/${formType}`, {
    params: { period }
  });
  return response.data;
};

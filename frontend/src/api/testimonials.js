import { api } from './api';

// Get all testimonials
export const getTestimonials = async (params = {}) => {
  const response = await api.get('/testimonials', { params });
  return response.data;
};

// Get a single testimonial by ID
export const getTestimonial = async (id) => {
  const response = await api.get(`/testimonials/${id}`);
  return response.data;
};

// Create a new testimonial
export const createTestimonial = async (testimonialData) => {
  const response = await api.post('/testimonials', testimonialData);
  return response.data;
};

// Update an existing testimonial
export const updateTestimonial = async (id, testimonialData) => {
  const response = await api.put(`/testimonials/${id}`, testimonialData);
  return response.data;
};

// Delete a testimonial
export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};

// Get public testimonials
export const getPublicTestimonials = async (params = {}) => {
  const response = await api.get('/testimonials/public', { params });
  return response.data;
};

// Get featured testimonials
export const getFeaturedTestimonials = async (limit = 6) => {
  const response = await api.get('/testimonials/featured', { params: { limit } });
  return response.data;
};

// Get testimonials by project
export const getTestimonialsByProject = async (projectId) => {
  const response = await api.get(`/testimonials/project/${projectId}`);
  return response.data;
};

// Get testimonials by client
export const getTestimonialsByClient = async (clientId) => {
  const response = await api.get(`/testimonials/client/${clientId}`);
  return response.data;
};

// Get testimonials by rating
export const getTestimonialsByRating = async (rating) => {
  const response = await api.get(`/testimonials/rating/${rating}`);
  return response.data;
};

// Get testimonials by status
export const getTestimonialsByStatus = async (status) => {
  const response = await api.get(`/testimonials/status/${status}`);
  return response.data;
};

// Get testimonials by category
export const getTestimonialsByCategory = async (category) => {
  const response = await api.get(`/testimonials/category/${category}`);
  return response.data;
};

// Get testimonials by tag
export const getTestimonialsByTag = async (tag) => {
  const response = await api.get(`/testimonials/tag/${tag}`);
  return response.data;
};

// Search testimonials
export const searchTestimonials = async (query, filters = {}) => {
  const response = await api.get('/testimonials/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Update testimonial status
export const updateTestimonialStatus = async (id, status) => {
  const response = await api.patch(`/testimonials/${id}/status`, { status });
  return response.data;
};

// Feature/unfeature testimonial
export const toggleTestimonialFeature = async (id, featured) => {
  const response = await api.patch(`/testimonials/${id}/feature`, { featured });
  return response.data;
};

// Approve testimonial
export const approveTestimonial = async (id) => {
  const response = await api.patch(`/testimonials/${id}/approve`);
  return response.data;
};

// Reject testimonial
export const rejectTestimonial = async (id, reason) => {
  const response = await api.patch(`/testimonials/${id}/reject`, { reason });
  return response.data;
};

// Add testimonial rating
export const addTestimonialRating = async (id, rating) => {
  const response = await api.post(`/testimonials/${id}/ratings`, { rating });
  return response.data;
};

// Get testimonial ratings
export const getTestimonialRatings = async (id) => {
  const response = await api.get(`/testimonials/${id}/ratings`);
  return response.data;
};

// Add testimonial comment
export const addTestimonialComment = async (id, comment) => {
  const response = await api.post(`/testimonials/${id}/comments`, comment);
  return response.data;
};

// Get testimonial comments
export const getTestimonialComments = async (id) => {
  const response = await api.get(`/testimonials/${id}/comments`);
  return response.data;
};

// Like testimonial
export const likeTestimonial = async (id) => {
  const response = await api.post(`/testimonials/${id}/like`);
  return response.data;
};

// Unlike testimonial
export const unlikeTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/${id}/like`);
  return response.data;
};

// Get testimonial likes
export const getTestimonialLikes = async (id) => {
  const response = await api.get(`/testimonials/${id}/likes`);
  return response.data;
};

// Share testimonial
export const shareTestimonial = async (id, platform) => {
  const response = await api.post(`/testimonials/${id}/share`, { platform });
  return response.data;
};

// Get testimonial shares
export const getTestimonialShares = async (id) => {
  const response = await api.get(`/testimonials/${id}/shares`);
  return response.data;
};

// Bookmark testimonial
export const bookmarkTestimonial = async (id) => {
  const response = await api.post(`/testimonials/${id}/bookmark`);
  return response.data;
};

// Remove testimonial bookmark
export const removeTestimonialBookmark = async (id) => {
  const response = await api.delete(`/testimonials/${id}/bookmark`);
  return response.data;
};

// Get testimonial bookmarks
export const getTestimonialBookmarks = async (id) => {
  const response = await api.get(`/testimonials/${id}/bookmarks`);
  return response.data;
};

// Flag testimonial
export const flagTestimonial = async (id, reason) => {
  const response = await api.post(`/testimonials/${id}/flag`, { reason });
  return response.data;
};

// Get testimonial flags
export const getTestimonialFlags = async (id) => {
  const response = await api.get(`/testimonials/${id}/flags`);
  return response.data;
};

// Add testimonial tag
export const addTestimonialTag = async (id, tag) => {
  const response = await api.post(`/testimonials/${id}/tags`, { tag });
  return response.data;
};

// Remove testimonial tag
export const removeTestimonialTag = async (id, tag) => {
  const response = await api.delete(`/testimonials/${id}/tags/${tag}`);
  return response.data;
};

// Get testimonial tags
export const getTestimonialTags = async (id) => {
  const response = await api.get(`/testimonials/${id}/tags`);
  return response.data;
};

// Update testimonial custom fields
export const updateTestimonialCustomFields = async (id, customFields) => {
  const response = await api.patch(`/testimonials/${id}/custom-fields`, customFields);
  return response.data;
};

// Get testimonial custom fields
export const getTestimonialCustomFields = async (id) => {
  const response = await api.get(`/testimonials/${id}/custom-fields`);
  return response.data;
};

// Get testimonial statistics
export const getTestimonialStats = async () => {
  const response = await api.get('/testimonials/stats');
  return response.data;
};

// Get testimonial analytics
export const getTestimonialAnalytics = async (period = '30d') => {
  const response = await api.get('/testimonials/analytics', { params: { period } });
  return response.data;
};

// Get testimonial insights
export const getTestimonialInsights = async (period = '30d') => {
  const response = await api.get('/testimonials/insights', { params: { period } });
  return response.data;
};

// Get testimonial recommendations
export const getTestimonialRecommendations = async (testimonialId) => {
  const response = await api.get(`/testimonials/${testimonialId}/recommendations`);
  return response.data;
};

// Get related testimonials
export const getRelatedTestimonials = async (testimonialId, limit = 5) => {
  const response = await api.get(`/testimonials/${testimonialId}/related`, { params: { limit } });
  return response.data;
};

// Get similar testimonials
export const getSimilarTestimonials = async (testimonialId, limit = 5) => {
  const response = await api.get(`/testimonials/${testimonialId}/similar`, { params: { limit } });
  return response.data;
};

// Get trending testimonials
export const getTrendingTestimonials = async (period = '7d', limit = 10) => {
  const response = await api.get('/testimonials/trending', { params: { period, limit } });
  return response.data;
};

// Get popular testimonials
export const getPopularTestimonials = async (period = '30d', limit = 10) => {
  const response = await api.get('/testimonials/popular', { params: { period, limit } });
  return response.data;
};

// Get recent testimonials
export const getRecentTestimonials = async (limit = 10) => {
  const response = await api.get('/testimonials/recent', { params: { limit } });
  return response.data;
};

// Get top-rated testimonials
export const getTopRatedTestimonials = async (limit = 10) => {
  const response = await api.get('/testimonials/top-rated', { params: { limit } });
  return response.data;
};

// Get most-liked testimonials
export const getMostLikedTestimonials = async (period = '30d', limit = 10) => {
  const response = await api.get('/testimonials/most-liked', { params: { period, limit } });
  return response.data;
};

// Get most-shared testimonials
export const getMostSharedTestimonials = async (period = '30d', limit = 10) => {
  const response = await api.get('/testimonials/most-shared', { params: { period, limit } });
  return response.data;
};

// Get most-commented testimonials
export const getMostCommentedTestimonials = async (period = '30d', limit = 10) => {
  const response = await api.get('/testimonials/most-commented', { params: { period, limit } });
  return response.data;
};

// Get most-bookmarked testimonials
export const getMostBookmarkedTestimonials = async (period = '30d', limit = 10) => {
  const response = await api.get('/testimonials/most-bookmarked', { params: { period, limit } });
  return response.data;
};

// Get most-viewed testimonials
export const getMostViewedTestimonials = async (period = '30d', limit = 10) => {
  const response = await api.get('/testimonials/most-viewed', { params: { period, limit } });
  return response.data;
};

// Export testimonials
export const exportTestimonials = async (format = 'csv', filters = {}) => {
  const response = await api.get('/testimonials/export', {
    params: { format, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

// Bulk update testimonials
export const bulkUpdateTestimonials = async (testimonialIds, updates) => {
  const response = await api.patch('/testimonials/bulk-update', {
    testimonialIds,
    updates
  });
  return response.data;
};

// Bulk delete testimonials
export const bulkDeleteTestimonials = async (testimonialIds) => {
  const response = await api.delete('/testimonials/bulk-delete', {
    data: { testimonialIds }
  });
  return response.data;
};

import { api } from './api';

// Get all public projects
export const getPublicProjects = async (params = {}) => {
  const response = await api.get('/public/projects', { params });
  return response.data;
};

// Get a single public project by slug
export const getPublicProject = async (slug) => {
  const response = await api.get(`/public/projects/${slug}`);
  return response.data;
};

// Get a single public project by ID
export const getPublicProjectById = async (id) => {
  const response = await api.get(`/public/projects/id/${id}`);
  return response.data;
};

// Get project categories
export const getProjectCategories = async () => {
  const response = await api.get('/public/projects/categories');
  return response.data;
};

// Get project tech stacks
export const getProjectTechStacks = async () => {
  const response = await api.get('/public/projects/tech-stacks');
  return response.data;
};

// Get project statuses
export const getProjectStatuses = async () => {
  const response = await api.get('/public/projects/statuses');
  return response.data;
};

// Get project tags
export const getProjectTags = async () => {
  const response = await api.get('/public/projects/tags');
  return response.data;
};

// Search public projects
export const searchPublicProjects = async (query, filters = {}) => {
  const response = await api.get('/public/projects/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Filter public projects
export const filterPublicProjects = async (filters = {}) => {
  const response = await api.get('/public/projects/filter', { params: filters });
  return response.data;
};

// Sort public projects
export const sortPublicProjects = async (sortBy = 'newest', sortOrder = 'desc') => {
  const response = await api.get('/public/projects/sort', {
    params: { sortBy, sortOrder }
  });
  return response.data;
};

// Paginate public projects
export const paginatePublicProjects = async (page = 1, limit = 12) => {
  const response = await api.get('/public/projects/paginate', {
    params: { page, limit }
  });
  return response.data;
};

// Get public project count
export const getPublicProjectCount = async (filters = {}) => {
  const response = await api.get('/public/projects/count', { params: filters });
  return response.data;
};

// Get public project summary
export const getPublicProjectSummary = async () => {
  const response = await api.get('/public/projects/summary');
  return response.data;
};

// Get public project trends
export const getPublicProjectTrends = async (period = '12m') => {
  const response = await api.get('/public/projects/trends', { params: { period } });
  return response.data;
};

// Get public project analytics
export const getPublicProjectAnalytics = async (period = '30d') => {
  const response = await api.get('/public/projects/analytics', { params: { period } });
  return response.data;
};

// Get public project insights
export const getPublicProjectInsights = async (period = '30d') => {
  const response = await api.get('/public/projects/insights', { params: { period } });
  return response.data;
};

// Get featured projects
export const getFeaturedProjects = async (limit = 6) => {
  const response = await api.get('/public/projects/featured', { params: { limit } });
  return response.data;
};

// Get recent projects
export const getRecentProjects = async (limit = 6) => {
  const response = await api.get('/public/projects/recent', { params: { limit } });
  return response.data;
};

// Get popular projects
export const getPopularProjects = async (period = '30d', limit = 6) => {
  const response = await api.get('/public/projects/popular', { params: { period, limit } });
  return response.data;
};

// Get trending projects
export const getTrendingProjects = async (period = '7d', limit = 6) => {
  const response = await api.get('/public/projects/trending', { params: { period, limit } });
  return response.data;
};

// Get top-rated projects
export const getTopRatedProjects = async (limit = 6) => {
  const response = await api.get('/public/projects/top-rated', { params: { limit } });
  return response.data;
};

// Get most-viewed projects
export const getMostViewedProjects = async (period = '30d', limit = 6) => {
  const response = await api.get('/public/projects/most-viewed', { params: { period, limit } });
  return response.data;
};

// Get most-liked projects
export const getMostLikedProjects = async (period = '30d', limit = 6) => {
  const response = await api.get('/public/projects/most-liked', { params: { period, limit } });
  return response.data;
};

// Get most-shared projects
export const getMostSharedProjects = async (period = '30d', limit = 6) => {
  const response = await api.get('/public/projects/most-shared', { params: { period, limit } });
  return response.data;
};

// Get most-commented projects
export const getMostCommentedProjects = async (period = '30d', limit = 6) => {
  const response = await api.get('/public/projects/most-commented', { params: { period, limit } });
  return response.data;
};

// Get most-bookmarked projects
export const getMostBookmarkedProjects = async (period = '30d', limit = 6) => {
  const response = await api.get('/public/projects/most-bookmarked', { params: { period, limit } });
  return response.data;
};

// Get related projects
export const getRelatedProjects = async (projectId, limit = 4) => {
  const response = await api.get(`/public/projects/${projectId}/related`, { params: { limit } });
  return response.data;
};

// Get similar projects
export const getSimilarProjects = async (projectId, limit = 4) => {
  const response = await api.get(`/public/projects/${projectId}/similar`, { params: { limit } });
  return response.data;
};

// Get projects by category
export const getProjectsByCategory = async (category, params = {}) => {
  const response = await api.get(`/public/projects/category/${category}`, { params });
  return response.data;
};

// Get projects by tech stack
export const getProjectsByTechStack = async (techStack, params = {}) => {
  const response = await api.get(`/public/projects/tech-stack/${techStack}`, { params });
  return response.data;
};

// Get projects by tag
export const getProjectsByTag = async (tag, params = {}) => {
  const response = await api.get(`/public/projects/tag/${tag}`, { params });
  return response.data;
};

// Get projects by client
export const getProjectsByClient = async (clientId, params = {}) => {
  const response = await api.get(`/public/projects/client/${clientId}`, { params });
  return response.data;
};

// Get projects by date range
export const getProjectsByDateRange = async (startDate, endDate, params = {}) => {
  const response = await api.get('/public/projects/date-range', {
    params: { startDate, endDate, ...params }
  });
  return response.data;
};

// Get projects by month
export const getProjectsByMonth = async (year, month, params = {}) => {
  const response = await api.get(`/public/projects/month/${year}/${month}`, { params });
  return response.data;
};

// Get projects by year
export const getProjectsByYear = async (year, params = {}) => {
  const response = await api.get(`/public/projects/year/${year}`, { params });
  return response.data;
};

// Get projects by quarter
export const getProjectsByQuarter = async (year, quarter, params = {}) => {
  const response = await api.get(`/public/projects/quarter/${year}/${quarter}`, { params });
  return response.data;
};

// Get projects by week
export const getProjectsByWeek = async (year, week, params = {}) => {
  const response = await api.get(`/public/projects/week/${year}/${week}`, { params });
  return response.data;
};

// Get projects by day
export const getProjectsByDay = async (year, month, day, params = {}) => {
  const response = await api.get(`/public/projects/day/${year}/${month}/${day}`, { params });
  return response.data;
};

// Get project recommendations
export const getProjectRecommendations = async (userId, limit = 6) => {
  const response = await api.get('/public/projects/recommendations', {
    params: { userId, limit }
  });
  return response.data;
};

// Get project suggestions
export const getProjectSuggestions = async (query, limit = 5) => {
  const response = await api.get('/public/projects/suggestions', {
    params: { query, limit }
  });
  return response.data;
};

// Get project autocomplete
export const getProjectAutocomplete = async (query, limit = 5) => {
  const response = await api.get('/public/projects/autocomplete', {
    params: { query, limit }
  });
  return response.data;
};

// Get project statistics
export const getPublicProjectStats = async () => {
  const response = await api.get('/public/projects/stats');
  return response.data;
};

// Get project metrics
export const getPublicProjectMetrics = async (period = '30d') => {
  const response = await api.get('/public/projects/metrics', { params: { period } });
  return response.data;
};

// Get project KPIs
export const getPublicProjectKPIs = async (period = '30d') => {
  const response = await api.get('/public/projects/kpis', { params: { period } });
  return response.data;
};

// Get project dashboard
export const getPublicProjectDashboard = async () => {
  const response = await api.get('/public/projects/dashboard');
  return response.data;
};

// Get project recommendations
export const getPublicProjectRecommendations = async (projectId) => {
  const response = await api.get(`/public/projects/${projectId}/recommendations`);
  return response.data;
};

// Get project suggestions
export const getPublicProjectSuggestions = async (query) => {
  const response = await api.get('/public/projects/suggestions', { params: { query } });
  return response.data;
};

// Get project autocomplete
export const getPublicProjectAutocomplete = async (query) => {
  const response = await api.get('/public/projects/autocomplete', { params: { query } });
  return response.data;
};

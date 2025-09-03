import { api } from './api';

// Get all projects
export const getProjects = async (params = {}) => {
  const response = await api.get('/projects', { params });
  return response.data;
};

// Get a single project by ID
export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

// Update an existing project
export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

// Delete a project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Get projects by status
export const getProjectsByStatus = async (status) => {
  const response = await api.get(`/projects/status/${status}`);
  return response.data;
};

// Get projects by category
export const getProjectsByCategory = async (category) => {
  const response = await api.get(`/projects/category/${category}`);
  return response.data;
};

// Get projects by client
export const getProjectsByClient = async (clientId) => {
  const response = await api.get(`/projects/client/${clientId}`);
  return response.data;
};

// Get projects by tech stack
export const getProjectsByTechStack = async (techStack) => {
  const response = await api.get(`/projects/tech-stack/${techStack}`);
  return response.data;
};

// Get projects by tag
export const getProjectsByTag = async (tag) => {
  const response = await api.get(`/projects/tag/${tag}`);
  return response.data;
};

// Search projects
export const searchProjects = async (query, filters = {}) => {
  const response = await api.get('/projects/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// Filter projects
export const filterProjects = async (filters = {}) => {
  const response = await api.get('/projects/filter', { params: filters });
  return response.data;
};

// Sort projects
export const sortProjects = async (sortBy = 'newest', sortOrder = 'desc') => {
  const response = await api.get('/projects/sort', {
    params: { sortBy, sortOrder }
  });
  return response.data;
};

// Paginate projects
export const paginateProjects = async (page = 1, limit = 10) => {
  const response = await api.get('/projects/paginate', {
    params: { page, limit }
  });
  return response.data;
};

// Get project count
export const getProjectCount = async (filters = {}) => {
  const response = await api.get('/projects/count', { params: filters });
  return response.data;
};

// Update project status
export const updateProjectStatus = async (id, status) => {
  const response = await api.patch(`/projects/${id}/status`, { status });
  return response.data;
};

// Update project progress
export const updateProjectProgress = async (id, progress) => {
  const response = await api.patch(`/projects/${id}/progress`, { progress });
  return response.data;
};

// Assign project to user
export const assignProject = async (id, userId) => {
  const response = await api.patch(`/projects/${id}/assign`, { userId });
  return response.data;
};

// Add project note
export const addProjectNote = async (id, note) => {
  const response = await api.post(`/projects/${id}/notes`, note);
  return response.data;
};

// Get project notes
export const getProjectNotes = async (id) => {
  const response = await api.get(`/projects/${id}/notes`);
  return response.data;
};

// Add project attachment
export const addProjectAttachment = async (id, attachmentData) => {
  const response = await api.post(`/projects/${id}/attachments`, attachmentData);
  return response.data;
};

// Get project attachments
export const getProjectAttachments = async (id) => {
  const response = await api.get(`/projects/${id}/attachments`);
  return response.data;
};

// Delete project attachment
export const deleteProjectAttachment = async (id, attachmentId) => {
  const response = await api.delete(`/projects/${id}/attachments/${attachmentId}`);
  return response.data;
};

// Add project tag
export const addProjectTag = async (id, tag) => {
  const response = await api.post(`/projects/${id}/tags`, { tag });
  return response.data;
};

// Remove project tag
export const removeProjectTag = async (id, tag) => {
  const response = await api.delete(`/projects/${id}/tags/${tag}`);
  return response.data;
};

// Get project tags
export const getProjectTags = async (id) => {
  const response = await api.get(`/projects/${id}/tags`);
  return response.data;
};

// Add project tech stack
export const addProjectTechStack = async (id, techStack) => {
  const response = await api.post(`/projects/${id}/tech-stack`, { techStack });
  return response.data;
};

// Remove project tech stack
export const removeProjectTechStack = async (id, techStack) => {
  const response = await api.delete(`/projects/${id}/tech-stack/${techStack}`);
  return response.data;
};

// Get project tech stack
export const getProjectTechStack = async (id) => {
  const response = await api.get(`/projects/${id}/tech-stack`);
  return response.data;
};

// Update project custom fields
export const updateProjectCustomFields = async (id, customFields) => {
  const response = await api.patch(`/projects/${id}/custom-fields`, customFields);
  return response.data;
};

// Get project custom fields
export const getProjectCustomFields = async (id) => {
  const response = await api.get(`/projects/${id}/custom-fields`);
  return response.data;
};

// Get project timeline
export const getProjectTimeline = async (id) => {
  const response = await api.get(`/projects/${id}/timeline`);
  return response.data;
};

// Get project activities
export const getProjectActivities = async (id) => {
  const response = await api.get(`/projects/${id}/activities`);
  return response.data;
};

// Add project activity
export const addProjectActivity = async (id, activity) => {
  const response = await api.post(`/projects/${id}/activities`, activity);
  return response.data;
};

// Get project statistics
export const getProjectStats = async () => {
  const response = await api.get('/projects/stats');
  return response.data;
};

// Get project analytics
export const getProjectAnalytics = async (period = '30d') => {
  const response = await api.get('/projects/analytics', { params: { period } });
  return response.data;
};

// Get project insights
export const getProjectInsights = async (period = '30d') => {
  const response = await api.get('/projects/insights', { params: { period } });
  return response.data;
};

// Get project recommendations
export const getProjectRecommendations = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/recommendations`);
  return response.data;
};

// Get related projects
export const getRelatedProjects = async (projectId, limit = 4) => {
  const response = await api.get(`/projects/${projectId}/related`, { params: { limit } });
  return response.data;
};

// Get similar projects
export const getSimilarProjects = async (projectId, limit = 4) => {
  const response = await api.get(`/projects/${projectId}/similar`, { params: { limit } });
  return response.data;
};

// Export projects
export const exportProjects = async (format = 'csv', filters = {}) => {
  const response = await api.get('/projects/export', {
    params: { format, ...filters },
    responseType: 'blob'
  });
  return response.data;
};

// Bulk update projects
export const bulkUpdateProjects = async (projectIds, updates) => {
  const response = await api.patch('/projects/bulk-update', {
    projectIds,
    updates
  });
  return response.data;
};

// Bulk delete projects
export const bulkDeleteProjects = async (projectIds) => {
  const response = await api.delete('/projects/bulk-delete', {
    data: { projectIds }
  });
  return response.data;
};

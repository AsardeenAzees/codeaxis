import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash,
  ThreeDots,
  Folder,
  Calendar,
  Person,
  DollarSign
} from 'react-bootstrap-icons';
import { getProjects, deleteProject } from '../../api/projects';
import { getSettings } from '../../api/settings';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Projects = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    client: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProjects, setSelectedProjects] = useState([]);

  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch settings for project configuration
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete project');
      console.error('Delete project error:', error);
    }
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      client: ''
    });
    setSortBy('newest');
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProjectMutation.mutateAsync(projectId);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) {
      toast.error('Please select projects to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedProjects.length} projects?`)) {
      try {
        await Promise.all(selectedProjects.map(id => deleteProjectMutation.mutateAsync(id)));
        setSelectedProjects([]);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProjects(projects?.map(p => p._id) || []);
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId, checked) => {
    if (checked) {
      setSelectedProjects(prev => [...prev, projectId]);
    } else {
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
    }
  };

  // Filter and sort projects
  const filteredProjects = projects?.filter(project => {
    if (filters.search && !project.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && project.status !== filters.status) {
      return false;
    }
    if (filters.category && project.category !== filters.category) {
      return false;
    }
    if (filters.client && project.client?.name !== filters.client) {
      return false;
    }
    return true;
  }) || [];

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'budget':
        return (b.budget || 0) - (a.budget || 0);
      default:
        return 0;
    }
  });

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'planning': 'secondary',
      'in-progress': 'primary',
      'review': 'warning',
      'completed': 'success',
      'on-hold': 'info',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const projectStatuses = settings?.projectConfiguration?.statuses || [];
  const projectCategories = settings?.projectConfiguration?.categories || [];

  return (
    <>
      <Helmet>
        <title>Projects - CodeAxis Admin</title>
      </Helmet>

      <div className="projects-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Projects</h1>
              <p className="text-muted mb-0">Manage your projects and track their progress</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" as={Link} to="/admin/projects/new">
                <Plus className="me-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search projects..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {projectStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {projectCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="status">Status</option>
                  <option value="budget">Budget</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                  <Filter className="me-1" />
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bulk Actions */}
        {selectedProjects.length > 0 && (
          <Card className="mb-4 border-warning">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">
                  {selectedProjects.length} project(s) selected
                </span>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={deleteProjectMutation.isLoading}
                  >
                    <Trash className="me-1" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSelectedProjects([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Projects Table */}
        <Card>
          <Card.Body className="p-0">
            {sortedProjects.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedProjects.length === sortedProjects.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Budget</th>
                    <th>Timeline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.map((project) => (
                    <motion.tr
                      key={project._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedProjects.includes(project._id)}
                          onChange={(e) => handleSelectProject(project._id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {project.coverImage ? (
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="project-thumb me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            <div className="project-thumb-placeholder me-3">
                              <Folder size={20} />
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{project.title}</div>
                            <small className="text-muted">{project.category}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Person size={16} className="text-muted me-2" />
                          <span>{project.client?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(project.status)}>
                          {project.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                            <div
                              className="progress-bar"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                          <small>{project.progress || 0}%</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <DollarSign size={16} className="text-muted me-2" />
                          <span>{project.budget ? `LKR ${project.budget.toLocaleString()}` : 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="text-muted me-2" />
                          <span>{project.timeline || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            as={Link}
                            to={`/admin/projects/${project._id}`}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            as={Link}
                            to={`/admin/projects/${project._id}/edit`}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              size="sm"
                              variant="outline-secondary"
                              className="dropdown-toggle-split"
                            >
                              <ThreeDots size={14} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/projects/${project._id}`}
                              >
                                <Eye className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/projects/${project._id}/edit`}
                              >
                                <Pencil className="me-2" />
                                Edit Project
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDeleteProject(project._id)}
                                disabled={deleteProjectMutation.isLoading}
                              >
                                <Trash className="me-2" />
                                Delete Project
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <Folder size={64} className="text-muted mb-3" />
                <h6 className="text-muted">No projects found</h6>
                <p className="text-muted mb-3">
                  {filters.search || filters.status || filters.category || filters.client
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first project'
                  }
                </p>
                <Button as={Link} to="/admin/projects/new" variant="primary">
                  <Plus className="me-2" />
                  Create Project
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Summary Stats */}
        <Row className="g-4 mt-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary mb-1">{sortedProjects.length}</h3>
                <p className="text-muted mb-0">Total Projects</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success mb-1">
                  {sortedProjects.filter(p => p.status === 'completed').length}
                </h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning mb-1">
                  {sortedProjects.filter(p => p.status === 'in-progress').length}
                </h3>
                <p className="text-muted mb-0">In Progress</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info mb-1">
                  {sortedProjects.filter(p => p.status === 'planning').length}
                </h3>
                <p className="text-muted mb-0">Planning</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Projects;

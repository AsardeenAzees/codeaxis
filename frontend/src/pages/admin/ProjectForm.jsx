import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Upload,
  Eye,
  Trash,
  Calendar,
  CurrencyDollar,
  Person,
  Folder,
  Link45deg
} from 'react-bootstrap-icons';
import { getProject, createProject, updateProject } from '../../api/projects';
import { getClients } from '../../api/clients';
import { getSettings } from '../../api/settings';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    techStack: [],
    status: 'planning',
    budget: '',
    timeline: '',
    startDate: '',
    endDate: '',
    client: '',
    progress: 0,
    isPublic: false,
    coverImage: null,
    attachments: [],
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');

  // Fetch project data if editing
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: isEditing,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch settings for project configuration
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 10 * 60 * 1000,
  });

  // Create/Update project mutation
  const projectMutation = useMutation({
    mutationFn: (data) => isEditing ? updateProject(id, data) : createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/admin/projects');
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} project`);
      console.error('Project mutation error:', error);
    }
  });

  // Load project data when editing
  useEffect(() => {
    if (project && isEditing) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        techStack: project.techStack || [],
        status: project.status || 'planning',
        budget: project.budget || '',
        timeline: project.timeline || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        client: project.client?._id || '',
        progress: project.progress || 0,
        isPublic: project.isPublic || false,
        coverImage: project.coverImage || null,
        attachments: project.attachments || [],
        tags: project.tags || []
      });
    }
  }, [project, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    
    if (field === 'coverImage') {
      setFormData(prev => ({
        ...prev,
        coverImage: files[0]
      }));
    } else if (field === 'attachments') {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTechStack = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechStack = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(tech => tech !== techToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Project category is required';
    }

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        progress: parseInt(formData.progress),
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined
      };

      await projectMutation.mutateAsync(submitData);
    } catch (error) {
      // Error is handled in onError
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProject) {
    return <LoadingSpinner />;
  }

  const projectStatuses = settings?.projectConfiguration?.statuses || [];
  const projectCategories = settings?.projectConfiguration?.categories || [];

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Project' : 'New Project'} - CodeAxis Admin</title>
      </Helmet>

      <div className="project-form-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              as={Link}
              to="/admin/projects"
              className="me-3"
            >
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="page-title">
                {isEditing ? 'Edit Project' : 'New Project'}
              </h1>
              <p className="text-muted mb-0">
                {isEditing ? 'Update project information' : 'Create a new project'}
              </p>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Main Project Information */}
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Project Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>Project Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter project title"
                          isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          isInvalid={!!errors.category}
                        >
                          <option value="">Select category</option>
                          {projectCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.category}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your project in detail..."
                          isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Tech Stack */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Technology Stack</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex gap-2 mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add technology (e.g., React, Node.js)"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                      />
                      <Button
                        type="button"
                        variant="outline-primary"
                        onClick={addTechStack}
                        disabled={!newTech.trim()}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.techStack.map((tech, index) => (
                        <Badge
                          key={index}
                          bg="primary"
                          className="d-flex align-items-center gap-1"
                        >
                          {tech}
                          <Button
                            type="button"
                            variant="link"
                            className="text-white p-0 ms-1"
                            onClick={() => removeTechStack(tech)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Project Details */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Project Details</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          {projectStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Progress (%)</Form.Label>
                        <Form.Control
                          type="number"
                          name="progress"
                          value={formData.progress}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          isInvalid={!!errors.progress}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.progress}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Tags */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Tags</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex gap-2 mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={addTag}
                        disabled={!newTag.trim()}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          bg="secondary"
                          className="d-flex align-items-center gap-1"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="link"
                            className="text-white p-0 ms-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              {/* Client & Budget */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Client & Budget</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Client *</Form.Label>
                    <Form.Select
                      name="client"
                      value={formData.client}
                      onChange={handleChange}
                      isInvalid={!!errors.client}
                    >
                      <option value="">Select client</option>
                      {clients?.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.client}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Budget (LKR)</Form.Label>
                    <Form.Control
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Enter budget amount"
                      min="0"
                      step="1000"
                      isInvalid={!!errors.budget}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.budget}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Timeline</Form.Label>
                    <Form.Control
                      type="text"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      placeholder="e.g., 2-3 months"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Visibility & Settings */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Visibility & Settings</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      label="Make project public in portfolio"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Cover Image */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Cover Image</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'coverImage')}
                    />
                  </Form.Group>
                  {formData.coverImage && (
                    <div className="mt-3">
                      <img
                        src={typeof formData.coverImage === 'string' ? formData.coverImage : URL.createObjectURL(formData.coverImage)}
                        alt="Cover preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Attachments */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Attachments</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'attachments')}
                    />
                  </Form.Group>
                  {formData.attachments.length > 0 && (
                    <div className="attachments-list">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center justify-content-between p-2 border rounded mb-2"
                        >
                          <div className="d-flex align-items-center">
                            <Folder className="me-2 text-muted" />
                            <span className="small">
                              {typeof file === 'string' ? file.split('/').pop() : file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => removeAttachment(index)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Form Actions */}
          <div className="form-actions mt-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/admin/projects"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="me-2" />
                        {isEditing ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ProjectForm;

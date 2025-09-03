import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  Eye, 
  Star, 
  Calendar, 
  Person,
  Globe,
  CodeSlash
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../api/public';
import { getSettings } from '../../api/settings';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Portfolio = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    techStack: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Fetch public projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: publicAPI.getPublicProjects,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch settings for categories and tech stacks
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    let filtered = projects.filter(project => {
      // Only show completed and public projects
      if (project.status !== 'completed' || !project.visibility.public) {
        return false;
      }

      // Search filter
      if (filters.search && !project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !project.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category && project.category !== filters.category) {
        return false;
      }

      // Tech stack filter
      if (filters.techStack && !project.techStack.includes(filters.techStack)) {
        return false;
      }

      return true;
    });

    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.completedDate) - new Date(b.completedDate));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [projects, filters, sortBy]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      techStack: '',
      status: ''
    });
    setSortBy('newest');
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="project-card h-100">
        {/* Project Image */}
        <div className="project-image-container">
          {project.coverImage ? (
            <img 
              src={project.coverImage} 
              alt={project.title}
              className="project-cover-image"
            />
          ) : (
            <div className="project-placeholder">
              <CodeSlash size={48} />
            </div>
          )}
          <div className="project-overlay">
            <Button 
              variant="light" 
              size="sm" 
              as={Link} 
              to={`/portfolio/${project.slug}`}
            >
              <Eye className="me-1" />
              View Details
            </Button>
          </div>
        </div>

        <Card.Body className="d-flex flex-column">
          {/* Project Header */}
          <div className="mb-3">
            <h5 className="card-title mb-2">{project.title}</h5>
            <p className="card-text text-muted mb-2">
              {project.description.length > 100 
                ? `${project.description.substring(0, 100)}...` 
                : project.description
              }
            </p>
          </div>

          {/* Client Info */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <Person size={16} className="text-muted me-2" />
              <small className="text-muted">
                {project.client?.organization || project.client?.name || 'Private Client'}
              </small>
            </div>
            {project.client?.website && (
              <div className="d-flex align-items-center">
                <Globe size={16} className="text-muted me-2" />
                <small className="text-muted">{project.client.website}</small>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-3">
              <small className="text-muted d-block mb-2">Tech Stack:</small>
              <div className="d-flex flex-wrap gap-1">
                {project.techStack.slice(0, 4).map((tech, index) => (
                  <Badge key={index} bg="secondary" className="tech-badge">
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 4 && (
                  <Badge bg="light" text="dark" className="tech-badge">
                    +{project.techStack.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Project Meta */}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <Calendar size={14} className="text-muted me-1" />
                <small className="text-muted">
                  {new Date(project.completedDate).toLocaleDateString()}
                </small>
              </div>
              {project.averageRating > 0 && (
                <div className="d-flex align-items-center">
                  <Star size={14} className="text-warning me-1" />
                  <small className="text-muted">{project.averageRating.toFixed(1)}</small>
                </div>
              )}
            </div>

            {/* Category */}
            {project.category && (
              <Badge bg="primary" className="category-badge">
                {project.category}
              </Badge>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  const ProjectListItem = ({ project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="project-list-item mb-3">
        <Row className="g-0">
          <Col md={3}>
            <div className="project-image-container">
              {project.coverImage ? (
                <img 
                  src={project.coverImage} 
                  alt={project.title}
                  className="project-list-image"
                />
              ) : (
                <div className="project-placeholder">
                  <CodeSlash size={32} />
                </div>
              )}
            </div>
          </Col>
          <Col md={9}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title mb-0">{project.title}</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  as={Link} 
                  to={`/portfolio/${project.slug}`}
                >
                  <Eye className="me-1" />
                  View Details
                </Button>
              </div>
              
              <p className="card-text text-muted mb-3">
                {project.description.length > 200 
                  ? `${project.description.substring(0, 200)}...` 
                  : project.description
                }
              </p>

              <div className="row">
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <Person size={16} className="text-muted me-2" />
                    <small className="text-muted">
                      {project.client?.organization || project.client?.name || 'Private Client'}
                    </small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={16} className="text-muted me-2" />
                    <small className="text-muted">
                      Completed: {new Date(project.completedDate).toLocaleDateString()}
                    </small>
                  </div>
                </Col>
                <Col md={6}>
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Tech Stack:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <Badge key={index} bg="secondary" size="sm">
                            {tech}
                          </Badge>
                        ))}
                        {project.techStack.length > 3 && (
                          <Badge bg="light" text="dark" size="sm">
                            +{project.techStack.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {project.category && (
                    <Badge bg="primary" size="sm">
                      {project.category}
                    </Badge>
                  )}
                </Col>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const categories = settings?.projectConfiguration?.categories || [];
  const techStacks = settings?.projectConfiguration?.techStacks || [];

  return (
    <>
      <Helmet>
        <title>Portfolio - CodeAxis</title>
        <meta name="description" content="Browse our completed projects and see our expertise in action. From web applications to mobile apps, discover our portfolio of successful client projects." />
      </Helmet>

      <div className="portfolio-page">
        {/* Hero Section */}
        <section className="portfolio-hero py-5 bg-light">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="display-4 fw-bold mb-3">Our Portfolio</h1>
                  <p className="lead text-muted mb-4">
                    Discover our completed projects and see how we've helped clients achieve their goals. 
                    Each project represents our commitment to quality, innovation, and client satisfaction.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" size="lg" as={Link} to="/hire-us">
                      Start Your Project
                    </Button>
                    <Button variant="outline-primary" size="lg" as={Link} to="/contact">
                      Get in Touch
                    </Button>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Filters and Search */}
        <section className="portfolio-filters py-4 border-bottom">
          <Container>
            <Row className="g-3">
              <Col md={6}>
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
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.techStack}
                  onChange={(e) => handleFilterChange('techStack', e.target.value)}
                >
                  <option value="">All Tech</option>
                  {techStacks.map((tech) => (
                    <option key={tech.value} value={tech.value}>
                      {tech.label}
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
                  <option value="rating">Highest Rated</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Filter className="me-1" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <Filter className="me-1" />
                      List
                    </Button>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">
                      {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                    </small>
                    {(filters.search || filters.category || filters.techStack) && (
                      <Button variant="link" size="sm" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Projects Grid/List */}
        <section className="portfolio-projects py-5">
          <Container>
            {filteredProjects.length > 0 ? (
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <Row className="g-4">
                    {filteredProjects.map((project) => (
                      <Col key={project._id} xs={12} sm={6} lg={4}>
                        <ProjectCard project={project} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div>
                    {filteredProjects.map((project) => (
                      <ProjectListItem key={project._id} project={project} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-5"
              >
                <CodeSlash size={64} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No projects found</h4>
                <p className="text-muted mb-4">
                  {filters.search || filters.category || filters.techStack
                    ? 'Try adjusting your filters or search terms.'
                    : 'We\'re working on new projects. Check back soon!'
                  }
                </p>
                {(filters.search || filters.category || filters.techStack) && (
                  <Button variant="primary" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </motion.div>
            )}
          </Container>
        </section>

        {/* CTA Section */}
        <section className="portfolio-cta py-5 bg-primary text-white">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-3">Ready to Start Your Project?</h2>
                  <p className="lead mb-4">
                    Let's discuss how we can help bring your ideas to life. 
                    Our team is ready to create something amazing for you.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="light" size="lg" as={Link} to="/hire-us">
                      Get Started
                    </Button>
                    <Button variant="outline-light" size="lg" as={Link} to="/contact">
                      Contact Us
                    </Button>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Portfolio;

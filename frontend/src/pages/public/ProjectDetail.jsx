import React from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  Person,
  Globe,
  CodeSlash,
  Star,
  ArrowLeft,
  Eye,
  Download,
  Share
} from 'react-bootstrap-icons';
import { getPublicProject } from '../../api/public';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProjectDetail = () => {
  const { slug } = useParams();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['public-project', slug],
    queryFn: () => getPublicProject(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !project) {
    return (
      <div className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h1 className="text-danger mb-3">Project Not Found</h1>
              <p className="text-muted mb-4">The project you're looking for doesn't exist or has been removed.</p>
              <Button as={Link} to="/portfolio" variant="primary">
                <ArrowLeft className="me-2" />
                Back to Portfolio
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} - CodeAxis Portfolio</title>
        <meta name="description" content={project.description} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description} />
        {project.coverImage && <meta property="og:image" content={project.coverImage} />}
      </Helmet>

      <div className="project-detail-page">
        {/* Hero Section */}
        <section className="project-hero py-5 bg-light">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Back Button */}
                  <div className="mb-4">
                    <Button as={Link} to="/portfolio" variant="outline-secondary" size="sm">
                      <ArrowLeft className="me-2" />
                      Back to Portfolio
                    </Button>
                  </div>

                  {/* Project Header */}
                  <div className="text-center mb-4">
                    <h1 className="display-4 fw-bold mb-3">{project.title}</h1>
                    <p className="lead text-muted mb-3">{project.description}</p>
                    
                    {/* Project Meta */}
                    <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
                      <div className="d-flex align-items-center">
                        <Person size={16} className="text-muted me-2" />
                        <span className="text-muted">
                          {project.client?.organization || project.client?.name || 'Private Client'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="text-muted me-2" />
                        <span className="text-muted">
                          {new Date(project.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                      {project.averageRating > 0 && (
                        <div className="d-flex align-items-center">
                          <Star size={16} className="text-warning me-2" />
                          <span className="text-muted">{project.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-center gap-3">
                      <Button variant="primary" size="lg">
                        <Eye className="me-2" />
                        View Live Demo
                      </Button>
                      <Button variant="outline-primary" size="lg">
                        <Download className="me-2" />
                        Download Case Study
                      </Button>
                      <Button variant="outline-secondary" size="lg">
                        <Share className="me-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Project Content */}
        <section className="project-content py-5">
          <Container>
            <Row className="g-5">
              {/* Main Content */}
              <Col lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Project Images */}
                  {project.coverImage && (
                    <Card className="mb-4">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="img-fluid rounded"
                      />
                    </Card>
                  )}

                  {/* Project Description */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h3>Project Overview</h3>
                    </Card.Header>
                    <Card.Body>
                      <div dangerouslySetInnerHTML={{ __html: project.description }} />
                    </Card.Body>
                  </Card>

                  {/* Project Details */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h3>Project Details</h3>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={6}>
                          <h6>Project Type</h6>
                          <p className="text-muted">{project.category || 'Web Development'}</p>
                        </Col>
                        <Col md={6}>
                          <h6>Timeline</h6>
                          <p className="text-muted">{project.timeline || '3-6 months'}</p>
                        </Col>
                        <Col md={6}>
                          <h6>Team Size</h6>
                          <p className="text-muted">{project.teamSize || '3-5 developers'}</p>
                        </Col>
                        <Col md={6}>
                          <h6>Project Status</h6>
                          <Badge bg="success">{project.status}</Badge>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Tech Stack */}
                  {project.techStack && project.techStack.length > 0 && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h3>Technologies Used</h3>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex flex-wrap gap-2">
                          {project.techStack.map((tech, index) => (
                            <Badge key={index} bg="primary" className="tech-badge">
                              <CodeSlash className="me-1" />
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Project Progress */}
                  {project.progress !== undefined && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h3>Project Progress</h3>
                      </Card.Header>
                      <Card.Body>
                        <ProgressBar
                          now={project.progress}
                          variant={project.progress >= 80 ? 'success' : project.progress >= 50 ? 'warning' : 'info'}
                          className="mb-2"
                        />
                        <small className="text-muted">{project.progress}% Complete</small>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Client Information */}
                  {project.client && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h3>Client Information</h3>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                          <div className="client-avatar me-3">
                            {project.client.logo ? (
                              <img
                                src={project.client.logo}
                                alt={project.client.name}
                                className="rounded-circle"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                                   style={{ width: '60px', height: '60px' }}>
                                <Person size={24} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h5 className="mb-1">{project.client.organization || project.client.name}</h5>
                            <p className="text-muted mb-1">{project.client.industry || 'Technology'}</p>
                            {project.client.website && (
                              <a href={project.client.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                <Globe className="me-1" />
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Testimonials */}
                  {project.testimonials && project.testimonials.length > 0 && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h3>Client Testimonials</h3>
                      </Card.Header>
                      <Card.Body>
                        {project.testimonials.map((testimonial, index) => (
                          <div key={index} className="testimonial-item mb-3 p-3 border rounded">
                            <div className="d-flex align-items-center mb-2">
                              <Star className="text-warning me-1" />
                              <span className="fw-bold">{testimonial.rating}/5</span>
                            </div>
                            <p className="mb-2">{testimonial.comment}</p>
                            <small className="text-muted">- {testimonial.clientName}</small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  )}
                </motion.div>
              </Col>

              {/* Sidebar */}
              <Col lg={4}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Project Stats */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5>Project Statistics</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="row text-center">
                        <div className="col-6 mb-3">
                          <div className="stat-number text-primary fw-bold">
                            {project.views || 0}
                          </div>
                          <small className="text-muted">Views</small>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="stat-number text-success fw-bold">
                            {project.likes || 0}
                          </div>
                          <small className="text-muted">Likes</small>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="stat-number text-info fw-bold">
                            {project.shares || 0}
                          </div>
                          <small className="text-muted">Shares</small>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="stat-number text-warning fw-bold">
                            {project.downloads || 0}
                          </div>
                          <small className="text-muted">Downloads</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Related Projects */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5>Related Projects</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted small">
                        Check out our other projects in similar categories.
                      </p>
                      <Button as={Link} to="/portfolio" variant="outline-primary" size="sm" className="w-100">
                        View All Projects
                      </Button>
                    </Card.Body>
                  </Card>

                  {/* Contact CTA */}
                  <Card>
                    <Card.Header>
                      <h5>Interested in Similar Work?</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted small mb-3">
                        Let's discuss how we can help bring your project to life.
                      </p>
                      <Button as={Link} to="/hire-us" variant="primary" size="sm" className="w-100 mb-2">
                        Start Your Project
                      </Button>
                      <Button as={Link} to="/contact" variant="outline-secondary" size="sm" className="w-100">
                        Get in Touch
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ProjectDetail;

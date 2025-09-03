import React from 'react'
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner'

// API
import { publicAPI } from '../../api/public'
import { getSettings } from '../../api/settings'

// Icons
import { 
  BiRocket, 
  BiCodeAlt, 
  BiDollar, 
  BiShield, 
  BiTrendingUp,
  BiCheckCircle,
  BiArrowRight,
  BiStar
} from 'react-icons/bi'

const Home = () => {
  // Fetch public projects for showcase
  const { data: projects, isLoading: projectsLoading } = useQuery(['publicProjects'], publicAPI.getPublicProjects, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch settings
  const { data: settings, isLoading: settingsLoading } = useQuery(['settings'], getSettings, {
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  if (settingsLoading || projectsLoading) {
    return <LoadingSpinner />
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Features data
  const features = [
    {
      icon: <BiRocket className="feature-icon" />,
      title: "Project Management",
      description: "Streamline your freelance projects with our comprehensive management system. Track progress, manage timelines, and collaborate effectively."
    },
    {
      icon: <BiDollar className="feature-icon" />,
      title: "Payment Tracking",
      description: "Keep track of all payments, generate invoices automatically, and maintain clear financial records for your projects."
    },
    {
      icon: <BiCodeAlt className="feature-icon" />,
      title: "Portfolio Showcase",
      description: "Display your completed projects professionally with our beautiful portfolio system. Impress potential clients with your work."
    },
    {
      icon: <BiShield className="feature-icon" />,
      title: "Client Management",
      description: "Organize client information, track communication, and build lasting relationships with your client base."
    },
    {
      icon: <BiTrendingUp className="feature-icon" />,
      title: "Analytics & Reports",
      description: "Get insights into your business performance with detailed analytics and comprehensive reporting tools."
    },
    {
      icon: <BiCheckCircle className="feature-icon" />,
      title: "Quality Assurance",
      description: "Ensure project quality with milestone tracking, testing phases, and comprehensive review processes."
    }
  ]

  // Stats data
  const stats = [
    { number: projects?.length || 0, label: "Projects Completed" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support Available" },
    { number: "5+", label: "Years Experience" }
  ]

  return (
    <>
      <Helmet>
        <title>
          {settings?.company?.name || 'CodeAxis'} - Professional Freelance Project Management
        </title>
        <meta name="description" content={settings?.company?.description || 'Transform your freelance business with our comprehensive project and payment management system. Professional, efficient, and reliable.'} />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold mb-4">
                  Transform Your Freelance Business
                </h1>
                <p className="lead mb-4">
                  Professional project management, payment tracking, and portfolio showcase system designed for modern freelancers and development teams.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <Button 
                    as={Link} 
                    to="/hire-us" 
                    variant="light" 
                    size="lg"
                    className="fw-bold"
                  >
                    <BiRocket className="me-2" />
                    Get Started
                  </Button>
                  <Button 
                    as={Link} 
                    to="/portfolio" 
                    variant="outline-light" 
                    size="lg"
                    className="fw-bold"
                  >
                    <BiCodeAlt className="me-2" />
                    View Portfolio
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="text-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="hero-image-placeholder">
                  <div className="hero-graphic">
                    <div className="floating-card card-1">
                      <BiCodeAlt />
                      <span>Projects</span>
                    </div>
                    <div className="floating-card card-2">
                      <BiDollar />
                      <span>Payments</span>
                    </div>
                    <div className="floating-card card-3">
                      <BiShield />
                      <span>Clients</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <motion.h2 variants={itemVariants} className="display-5 fw-bold mb-3">
              Why Choose {settings?.company?.name || 'CodeAxis'}?
            </motion.h2>
            <motion.p variants={itemVariants} className="lead text-muted">
              Comprehensive solutions designed to streamline your freelance operations
            </motion.p>
          </motion.div>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index}>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="h-100 feature-card border-0 shadow-sm">
                    <Card.Body className="text-center p-4">
                      <div className="feature-icon-wrapper mb-3">
                        {feature.icon}
                      </div>
                      <Card.Title className="h5 fw-bold mb-3">{feature.title}</Card.Title>
                      <Card.Text className="text-muted">{feature.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="stat-number display-4 fw-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="stat-label text-muted fw-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Portfolio Preview Section */}
      {projects && projects.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-5"
            >
              <h2 className="display-5 fw-bold mb-3">Featured Projects</h2>
              <p className="lead text-muted">
                Take a look at some of our recent work
              </p>
            </motion.div>

            <Row className="g-4">
              {projects.slice(0, 3).map((project, index) => (
                <Col lg={4} md={6} key={project._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-100 project-card border-0 shadow-sm">
                      {project.coverImage?.url && (
                        <div className="project-image-wrapper">
                          <Card.Img 
                            variant="top" 
                            src={project.coverImage.url} 
                            alt={project.title}
                            className="project-image"
                          />
                          <div className="project-overlay">
                            <Button 
                              as={Link} 
                              to={`/portfolio/${project.slug}`}
                              variant="light"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="primary" className="text-uppercase">
                            {project.category}
                          </Badge>
                          <div className="d-flex align-items-center">
                            <BiStar className="text-warning me-1" />
                            <small className="text-muted">5.0</small>
                          </div>
                        </div>
                        <Card.Title className="h6 fw-bold mb-2">{project.title}</Card.Title>
                        <Card.Text className="text-muted small mb-3">
                          {project.shortDescription || project.description.substring(0, 100)}...
                        </Card.Text>
                        <div className="d-flex flex-wrap gap-1">
                          {project.techStack?.slice(0, 3).map((tech, techIndex) => (
                            <Badge key={techIndex} bg="light" text="dark" className="small">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-5"
            >
              <Button 
                as={Link} 
                to="/portfolio" 
                variant="outline-primary" 
                size="lg"
                className="fw-bold"
              >
                View All Projects
                <BiArrowRight className="ms-2" />
              </Button>
            </motion.div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="cta-card bg-primary text-white p-5 rounded-4">
              <h2 className="display-6 fw-bold mb-3">
                Ready to Get Started?
              </h2>
              <p className="lead mb-4">
                Join thousands of freelancers who trust {settings?.company?.name || 'CodeAxis'} to manage their projects and grow their business.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button 
                  as={Link} 
                  to="/hire-us" 
                  variant="light" 
                  size="lg"
                  className="fw-bold"
                >
                  <BiUserPlus className="me-2" />
                  Get Your Quote
                </Button>
                <Button 
                  as={Link} 
                  to="/contact" 
                  variant="outline-light" 
                  size="lg"
                  className="fw-bold"
                >
                  <BiEnvelope className="me-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Custom CSS */}
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .hero-image-placeholder {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hero-graphic {
          position: relative;
          width: 300px;
          height: 300px;
        }
        
        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          font-size: 0.9rem;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-card svg {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .card-1 {
          top: 0;
          left: 0;
          animation-delay: 0s;
        }
        
        .card-2 {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          animation-delay: 2s;
        }
        
        .card-3 {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .feature-card {
          transition: var(--transition);
          cursor: pointer;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg) !important;
        }
        
        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: white;
        }
        
        .stat-number {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .project-card {
          transition: var(--transition);
          cursor: pointer;
        }
        
        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg) !important;
        }
        
        .project-image-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .project-image {
          height: 200px;
          object-fit: cover;
          transition: var(--transition);
        }
        
        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition);
        }
        
        .project-card:hover .project-overlay {
          opacity: 1;
        }
        
        .project-card:hover .project-image {
          transform: scale(1.1);
        }
        
        .cta-card {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 0;
          }
          
          .hero-image-placeholder {
            height: 300px;
            margin-top: 2rem;
          }
          
          .hero-graphic {
            width: 250px;
            height: 250px;
          }
          
          .floating-card {
            font-size: 0.8rem;
            padding: 0.75rem;
          }
          
          .floating-card svg {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  )
}

export default Home

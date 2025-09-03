import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Envelope, 
  Phone, 
  GeoAlt, 
  Globe, 
  Clock, 
  Send,
  CheckCircle
} from 'react-bootstrap-icons';
import { getSettings } from '../../api/settings';
import { contactAPI } from '../../api/contact';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch company settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 15 * 60 * 1000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

                try {
              await contactAPI.submitContactForm(formData);
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ContactInfoCard = ({ icon: Icon, title, content, link, linkText }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="contact-info-card h-100 text-center">
        <Card.Body className="p-4">
          <div className="contact-icon mb-3">
            <Icon size={32} />
          </div>
          <h5 className="card-title mb-3">{title}</h5>
          <p className="card-text text-muted mb-3">{content}</p>
          {link && (
            <a href={link} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const companyInfo = settings?.companyInformation || {};

  return (
    <>
      <Helmet>
        <title>Contact Us - CodeAxis</title>
        <meta name="description" content="Get in touch with CodeAxis. We're here to help with your project needs, questions, or collaboration opportunities." />
      </Helmet>

      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero py-5 bg-light">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="display-4 fw-bold mb-3">Get in Touch</h1>
                  <p className="lead text-muted mb-4">
                    Have a project in mind? Need help with development? 
                    We'd love to hear from you and discuss how we can help bring your ideas to life.
                  </p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Information */}
        <section className="contact-info py-5">
          <Container>
            <Row className="g-4">
              <Col md={4}>
                <ContactInfoCard
                  icon={Envelope}
                  title="Email Us"
                  content={companyInfo.email || "info@codeaxis.com"}
                  link={`mailto:${companyInfo.email || 'info@codeaxis.com'}`}
                  linkText="Send Email"
                />
              </Col>
              <Col md={4}>
                <ContactInfoCard
                  icon={Phone}
                  title="Call Us"
                  content={companyInfo.phone || "+94 11 234 5678"}
                  link={`tel:${companyInfo.phone || '+94112345678'}`}
                  linkText="Call Now"
                />
              </Col>
              <Col md={4}>
                <ContactInfoCard
                  icon={GeoAlt}
                  title="Visit Us"
                  content={companyInfo.address || "Colombo, Sri Lanka"}
                  link={companyInfo.googleMapsUrl}
                  linkText="View on Map"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Form and Additional Info */}
        <section className="contact-form-section py-5">
          <Container>
            <Row className="g-5">
              {/* Contact Form */}
              <Col lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="contact-form-card">
                    <Card.Header>
                      <h3 className="mb-0">Send us a Message</h3>
                      <p className="text-muted mb-0">Fill out the form below and we'll get back to you as soon as possible.</p>
                    </Card.Header>
                    <Card.Body className="p-4">
                      {submitSuccess ? (
                        <div className="text-center py-5">
                          <CheckCircle size={64} className="text-success mb-3" />
                          <h4 className="text-success mb-3">Message Sent Successfully!</h4>
                          <p className="text-muted mb-4">
                            Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                          </p>
                          <Button 
                            variant="outline-primary" 
                            onClick={() => setSubmitSuccess(false)}
                          >
                            Send Another Message
                          </Button>
                        </div>
                      ) : (
                        <Form onSubmit={handleSubmit}>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Full Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="Enter your full name"
                                  required
                                  disabled={isSubmitting}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Email Address *</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="Enter your email address"
                                  required
                                  disabled={isSubmitting}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder="Enter your phone number"
                                  disabled={isSubmitting}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Subject *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="subject"
                                  value={formData.subject}
                                  onChange={handleChange}
                                  placeholder="What is this about?"
                                  required
                                  disabled={isSubmitting}
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Form.Group>
                                <Form.Label>Message *</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={5}
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  placeholder="Tell us about your project or inquiry..."
                                  required
                                  disabled={isSubmitting}
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <div className="d-grid">
                                <Button
                                  type="submit"
                                  variant="primary"
                                  size="lg"
                                  disabled={isSubmitting}
                                  className="contact-submit-btn"
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
                                      Sending Message...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="me-2" />
                                      Send Message
                                    </>
                                  )}
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              {/* Additional Information */}
              <Col lg={4}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="contact-info-sidebar h-100">
                    <Card.Header>
                      <h4 className="mb-0">Additional Information</h4>
                    </Card.Header>
                    <Card.Body>
                      {/* Business Hours */}
                      <div className="mb-4">
                        <h6 className="d-flex align-items-center mb-3">
                          <Clock className="me-2" />
                          Business Hours
                        </h6>
                        <div className="business-hours">
                          <div className="d-flex justify-content-between">
                            <span>Monday - Friday:</span>
                            <span>9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Saturday:</span>
                            <span>10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Sunday:</span>
                            <span>Closed</span>
                          </div>
                        </div>
                      </div>

                      {/* Response Time */}
                      <div className="mb-4">
                        <h6>Response Time</h6>
                        <p className="text-muted small mb-0">
                          We typically respond to all inquiries within 24 hours during business days.
                          For urgent matters, please call us directly.
                        </p>
                      </div>

                      {/* Social Media */}
                      {companyInfo.socialMedia && (
                        <div className="mb-4">
                          <h6>Follow Us</h6>
                          <div className="d-flex gap-2">
                            {companyInfo.socialMedia.linkedin && (
                              <a 
                                href={companyInfo.socialMedia.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm"
                              >
                                <Globe />
                              </a>
                            )}
                            {companyInfo.socialMedia.twitter && (
                              <a 
                                href={companyInfo.socialMedia.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-info btn-sm"
                              >
                                <Globe />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* FAQ Link */}
                      <div className="text-center">
                        <Button variant="link" className="text-decoration-none">
                          View FAQ
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Map Section */}
        {companyInfo.googleMapsUrl && (
          <section className="contact-map py-5 bg-light">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Row className="justify-content-center">
                  <Col lg={10}>
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">Our Location</h4>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <div className="map-container" style={{ height: '400px' }}>
                          <iframe
                            src={companyInfo.googleMapsUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="CodeAxis Location"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </motion.div>
            </Container>
          </section>
        )}
      </div>
    </>
  );
};

export default Contact;

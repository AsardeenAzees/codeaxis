import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle } from 'react-bootstrap-icons';
import { getSettings } from '../../api/settings';
import { contactAPI } from '../../api/contact';
import toast from 'react-hot-toast';

const HireUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    projectTitle: '',
    projectBrief: '',
    budgetRange: '',
    timeline: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 15 * 60 * 1000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

                try {
              await contactAPI.submitProjectRequest(formData);
              toast.success('Project request submitted successfully!');
              setSubmitSuccess(true);
            } catch (error) {
              console.error('Project request error:', error);
              toast.error('Failed to submit request. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
  };

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" role="status" />
    </div>;
  }

  if (submitSuccess) {
    return (
      <div className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <CheckCircle size={80} className="text-success mb-4" />
              <h1 className="text-success mb-3">Request Submitted!</h1>
              <p className="lead">We'll get back to you within 24 hours.</p>
              <Button variant="primary" onClick={() => setSubmitSuccess(false)}>
                Submit Another Request
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
        <title>Hire Us - CodeAxis</title>
        <meta name="description" content="Submit your project request and let our team create something amazing for you." />
      </Helmet>

      <div className="hire-us-page">
        <section className="py-5 bg-primary text-white">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <h1 className="display-4 fw-bold mb-3">Let's Build Something Amazing</h1>
                <p className="lead">Tell us about your project and we'll create a custom solution.</p>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="py-5">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card>
                  <Card.Header>
                    <h3>Project Request Form</h3>
                  </Card.Header>
                  <Card.Body>
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
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Phone *</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Organization</Form.Label>
                            <Form.Control
                              type="text"
                              name="organization"
                              value={formData.organization}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label>Project Title *</Form.Label>
                            <Form.Control
                              type="text"
                              name="projectTitle"
                              value={formData.projectTitle}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label>Project Brief *</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              name="projectBrief"
                              value={formData.projectBrief}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Budget Range</Form.Label>
                            <Form.Select name="budgetRange" value={formData.budgetRange} onChange={handleChange}>
                              <option value="">Select budget</option>
                              <option value="under-100k">Under LKR 100,000</option>
                              <option value="100k-500k">LKR 100,000 - 500,000</option>
                              <option value="500k-1m">LKR 500,000 - 1,000,000</option>
                              <option value="over-1m">Over LKR 1,000,000</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Timeline</Form.Label>
                            <Form.Select name="timeline" value={formData.timeline} onChange={handleChange}>
                              <option value="">Select timeline</option>
                              <option value="1-month">1 month</option>
                              <option value="2-3-months">2-3 months</option>
                              <option value="3-6-months">3-6 months</option>
                              <option value="6-months-plus">6+ months</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <div className="d-grid">
                            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                              {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default HireUs;

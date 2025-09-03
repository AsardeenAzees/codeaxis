import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
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
  Person,
  Building,
  Envelope,
  Phone,
  Globe,
  MapPin,
  Calendar
} from 'react-bootstrap-icons';
import { getClient, createClient, updateClient } from '../../api/clients';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'individual',
    status: 'active',
    website: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    postalCode: '',
    notes: '',
    avatar: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client data if editing
  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id),
    enabled: isEditing,
    staleTime: 5 * 60 * 1000,
  });

  // Create/Update client mutation
  const clientMutation = useMutation({
    mutationFn: (data) => isEditing ? updateClient(id, data) : createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      toast.success(`Client ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/admin/clients');
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} client`);
      console.error('Client mutation error:', error);
    }
  });

  // Load client data when editing
  useEffect(() => {
    if (client && isEditing) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        type: client.type || 'individual',
        status: client.status || 'active',
        website: client.website || '',
        address: client.address || '',
        city: client.city || '',
        country: client.country || 'Sri Lanka',
        postalCode: client.postalCode || '',
        notes: client.notes || '',
        avatar: client.avatar || null
      });
    }
  }, [client, isEditing]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)';
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
        website: formData.website || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        postalCode: formData.postalCode || undefined,
        notes: formData.notes || undefined
      };

      await clientMutation.mutateAsync(submitData);
    } catch (error) {
      // Error is handled in onError
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingClient) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Client' : 'New Client'} - CodeAxis Admin</title>
      </Helmet>

      <div className="client-form-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              as={Link}
              to="/admin/clients"
              className="me-3"
            >
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="page-title">
                {isEditing ? 'Edit Client' : 'New Client'}
              </h1>
              <p className="text-muted mb-0">
                {isEditing ? 'Update client information' : 'Add a new client to your system'}
              </p>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Main Client Information */}
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Basic Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter client's full name"
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Client Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="individual">Individual</option>
                          <option value="company">Company</option>
                          <option value="startup">Startup</option>
                          <option value="enterprise">Enterprise</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
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
                          placeholder="Enter phone number"
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    {formData.type !== 'individual' && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Enter company name"
                          />
                        </Form.Group>
                      </Col>
                    )}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Contact Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Contact Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          isInvalid={!!errors.website}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.website}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Enter country"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter street address"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="Enter postal code"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Additional Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Additional Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any additional notes about this client..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              {/* Avatar Upload */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Profile Picture</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center">
                    {formData.avatar ? (
                      <div className="mb-3">
                        <img
                          src={typeof formData.avatar === 'string' ? formData.avatar : URL.createObjectURL(formData.avatar)}
                          alt="Avatar preview"
                          className="img-fluid rounded-circle mb-3"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <div className="d-grid gap-2">
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={removeAvatar}
                          >
                            <X className="me-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <div className="avatar-placeholder mb-3">
                          <Person size={64} className="text-muted" />
                        </div>
                      </div>
                    )}
                    <Form.Group>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Form.Text className="text-muted">
                        Upload a profile picture (JPG, PNG, GIF)
                      </Form.Text>
                    </Form.Group>
                  </div>
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      variant="outline-primary"
                      as={Link}
                      to="/admin/projects/new"
                    >
                      <Plus className="me-2" />
                      Create Project
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      as={Link}
                      to="/admin/payments/new"
                    >
                      <Calendar className="me-2" />
                      Record Payment
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Client Stats */}
              {isEditing && client && (
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Client Statistics</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Projects:</span>
                      <strong>{client.projectCount || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Active Projects:</span>
                      <strong>{client.activeProjectCount || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Revenue:</span>
                      <strong>LKR {(client.totalRevenue || 0).toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Member Since:</span>
                      <strong>
                        {new Date(client.createdAt).toLocaleDateString()}
                      </strong>
                    </div>
                  </Card.Body>
                </Card>
              )}
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
                    to="/admin/clients"
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
                        {isEditing ? 'Update Client' : 'Create Client'}
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

export default ClientForm;

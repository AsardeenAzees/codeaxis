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
  CreditCard,
  Calendar,
  CurrencyDollar,
  Person,
  Building,
  FileText,
  Receipt
} from 'react-bootstrap-icons';
import { getPayment, createPayment, updatePayment } from '../../api/payments';
import { getProjects } from '../../api/projects';
import { getClients } from '../../api/clients';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const PaymentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    reference: '',
    description: '',
    amount: '',
    type: 'invoice',
    status: 'pending',
    paymentDate: '',
    dueDate: '',
    project: '',
    client: '',
    method: 'bank_transfer',
    notes: '',
    invoice: null,
    receipt: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch payment data if editing
  const { data: payment, isLoading: isLoadingPayment } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPayment(id),
    enabled: isEditing,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 10 * 60 * 1000,
  });

  // Create/Update payment mutation
  const paymentMutation = useMutation({
    mutationFn: (data) => isEditing ? updatePayment(id, data) : createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      toast.success(`Payment ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/admin/payments');
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} payment`);
      console.error('Payment mutation error:', error);
    }
  });

  // Load payment data when editing
  useEffect(() => {
    if (payment && isEditing) {
      setFormData({
        reference: payment.reference || '',
        description: payment.description || '',
        amount: payment.amount || '',
        type: payment.type || 'invoice',
        status: payment.status || 'pending',
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
        dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : '',
        project: payment.project?._id || '',
        client: payment.client?._id || '',
        method: payment.method || 'bank_transfer',
        notes: payment.notes || '',
        invoice: payment.invoice || null,
        receipt: payment.receipt || null
      });
      setSelectedProject(payment.project || null);
    }
  }, [payment, isEditing]);

  // Update client when project changes
  useEffect(() => {
    if (formData.project && projects) {
      const project = projects.find(p => p._id === formData.project);
      if (project && project.client) {
        setFormData(prev => ({
          ...prev,
          client: project.client._id
        }));
        setSelectedProject(project);
      }
    }
  }, [formData.project, projects]);

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
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const removeFile = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const generateReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const reference = `PAY-${timestamp}-${random}`;
    setFormData(prev => ({
      ...prev,
      reference
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reference.trim()) {
      newErrors.reference = 'Payment reference is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.project) {
      newErrors.project = 'Project is required';
    }

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (formData.paymentDate && formData.dueDate && new Date(formData.paymentDate) > new Date(formData.dueDate)) {
      newErrors.paymentDate = 'Payment date cannot be after due date';
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
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate || undefined,
        dueDate: formData.dueDate || undefined,
        notes: formData.notes || undefined
      };

      await paymentMutation.mutateAsync(submitData);
    } catch (error) {
      // Error is handled in onError
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPayment) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Payment' : 'New Payment'} - CodeAxis Admin</title>
      </Helmet>

      <div className="payment-form-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              as={Link}
              to="/admin/payments"
              className="me-3"
            >
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="page-title">
                {isEditing ? 'Edit Payment' : 'New Payment'}
              </h1>
              <p className="text-muted mb-0">
                {isEditing ? 'Update payment information' : 'Record a new payment transaction'}
              </p>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Main Payment Information */}
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Payment Details</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Reference *</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            placeholder="Payment reference"
                            isInvalid={!!errors.reference}
                          />
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={generateReference}
                            title="Generate reference"
                          >
                            <Plus />
                          </Button>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.reference}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Amount (LKR) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          isInvalid={!!errors.amount}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.amount}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Payment Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="invoice">Invoice</option>
                          <option value="receipt">Receipt</option>
                          <option value="advance">Advance Payment</option>
                          <option value="milestone">Milestone Payment</option>
                          <option value="final">Final Payment</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Payment description or purpose..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Project & Client Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Project & Client</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Project *</Form.Label>
                        <Form.Select
                          name="project"
                          value={formData.project}
                          onChange={handleChange}
                          isInvalid={!!errors.project}
                        >
                          <option value="">Select project</option>
                          {projects?.map((project) => (
                            <option key={project._id} value={project._id}>
                              {project.title}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.project}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
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
                    </Col>
                    {selectedProject && (
                      <Col xs={12}>
                        <div className="project-info p-3 bg-light rounded">
                          <h6 className="mb-2">Project Information</h6>
                          <div className="row">
                            <div className="col-md-6">
                              <small className="text-muted">Budget:</small>
                              <div className="fw-semibold">
                                LKR {(selectedProject.budget || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <small className="text-muted">Status:</small>
                              <div className="fw-semibold">{selectedProject.status}</div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {/* Payment Schedule */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Payment Schedule</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Payment Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          isInvalid={!!errors.paymentDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.paymentDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
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
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select
                          name="method"
                          value={formData.method}
                          onChange={handleChange}
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="debit_card">Debit Card</option>
                          <option value="cash">Cash</option>
                          <option value="check">Check</option>
                          <option value="paypal">PayPal</option>
                          <option value="stripe">Stripe</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                          type="text"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Additional notes..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              {/* Invoice Upload */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Invoice</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'invoice')}
                    />
                    <Form.Text className="text-muted">
                      Upload invoice document (PDF, DOC, or image)
                    </Form.Text>
                  </Form.Group>
                  {formData.invoice && (
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                        <div className="d-flex align-items-center">
                          <FileText className="me-2 text-muted" />
                          <span className="small">
                            {typeof formData.invoice === 'string' ? formData.invoice.split('/').pop() : formData.invoice.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => removeFile('invoice')}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Receipt Upload */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Receipt</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'receipt')}
                    />
                    <Form.Text className="text-muted">
                      Upload receipt document (PDF, DOC, or image)
                    </Form.Text>
                  </Form.Group>
                  {formData.receipt && (
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                        <div className="d-flex align-items-center">
                          <Receipt className="me-2 text-muted" />
                          <span className="small">
                            {typeof formData.receipt === 'string' ? formData.receipt.split('/').pop() : formData.receipt.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => removeFile('receipt')}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
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
                      to="/admin/clients/new"
                    >
                      <Person className="me-2" />
                      Add Client
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Payment Stats */}
              {isEditing && payment && (
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Payment Statistics</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Created:</span>
                      <strong>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Last Updated:</span>
                      <strong>
                        {new Date(payment.updatedAt).toLocaleDateString()}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Payment ID:</span>
                      <strong className="text-muted">{payment._id.slice(-8)}</strong>
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
                    to="/admin/payments"
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
                        {isEditing ? 'Update Payment' : 'Create Payment'}
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

export default PaymentForm;

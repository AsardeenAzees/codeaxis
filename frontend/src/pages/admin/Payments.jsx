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
  CreditCard,
  Calendar,
  DollarSign,
  Person,
  Building,
  FileText,
  Download
} from 'react-bootstrap-icons';
import { getPayments, deletePayment } from '../../api/payments';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Payments = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    project: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPayments, setSelectedPayments] = useState([]);

  const queryClient = useQueryClient();

  // Fetch payments
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      toast.success('Payment deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete payment');
      console.error('Delete payment error:', error);
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
      type: '',
      project: ''
    });
    setSortBy('newest');
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePaymentMutation.mutateAsync(paymentId);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPayments.length === 0) {
      toast.error('Please select payments to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedPayments.length} payments?`)) {
      try {
        await Promise.all(selectedPayments.map(id => deletePaymentMutation.mutateAsync(id)));
        setSelectedPayments([]);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayments(payments?.map(p => p._id) || []);
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId, checked) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, paymentId]);
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    }
  };

  // Filter and sort payments
  const filteredPayments = payments?.filter(payment => {
    if (filters.search && !payment.reference.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && payment.status !== filters.status) {
      return false;
    }
    if (filters.type && payment.type !== filters.type) {
      return false;
    }
    if (filters.project && payment.project?.title !== filters.project) {
      return false;
    }
    return true;
  }) || [];

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'amount':
        return (b.amount || 0) - (a.amount || 0);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'pending': 'warning',
      'completed': 'success',
      'failed': 'danger',
      'cancelled': 'secondary',
      'refunded': 'info'
    };
    return statusMap[status] || 'secondary';
  };

  const getTypeBadgeVariant = (type) => {
    const typeMap = {
      'invoice': 'primary',
      'receipt': 'success',
      'advance': 'info',
      'milestone': 'warning',
      'final': 'dark'
    };
    return typeMap[type] || 'secondary';
  };

  const formatCurrency = (amount) => {
    return `LKR ${(amount || 0).toLocaleString()}`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Payments - CodeAxis Admin</title>
      </Helmet>

      <div className="payments-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Payments</h1>
              <p className="text-muted mb-0">Track and manage all payment transactions</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" as={Link} to="/admin/payments/new">
                <Plus className="me-2" />
                New Payment
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search payments..."
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
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="invoice">Invoice</option>
                  <option value="receipt">Receipt</option>
                  <option value="advance">Advance</option>
                  <option value="milestone">Milestone</option>
                  <option value="final">Final</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                  <option value="type">Type</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                  <Filter className="me-1" />
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bulk Actions */}
        {selectedPayments.length > 0 && (
          <Card className="mb-4 border-warning">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">
                  {selectedPayments.length} payment(s) selected
                </span>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={deletePaymentMutation.isLoading}
                  >
                    <Trash className="me-1" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSelectedPayments([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Payments Table */}
        <Card>
          <Card.Body className="p-0">
            {sortedPayments.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPayments.length === sortedPayments.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Payment</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPayments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedPayments.includes(payment._id)}
                          onChange={(e) => handleSelectPayment(payment._id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="payment-icon me-3">
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold">{payment.reference}</div>
                            <small className="text-muted">
                              {payment.description || 'No description'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Person size={16} className="text-muted me-2" />
                          <span>{payment.client?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Building size={16} className="text-muted me-2" />
                          <span>{payment.project?.title || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <DollarSign size={16} className="text-muted me-2" />
                          <span className="fw-semibold">
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getTypeBadgeVariant(payment.type)}>
                          {payment.type}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="text-muted me-2" />
                          <small>
                            {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            as={Link}
                            to={`/admin/payments/${payment._id}`}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            as={Link}
                            to={`/admin/payments/${payment._id}/edit`}
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
                                to={`/admin/payments/${payment._id}`}
                              >
                                <Eye className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/payments/${payment._id}/edit`}
                              >
                                <Pencil className="me-2" />
                                Edit Payment
                              </Dropdown.Item>
                              {payment.invoice && (
                                <Dropdown.Item
                                  href={payment.invoice}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="me-2" />
                                  View Invoice
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item
                                onClick={() => {
                                  // Handle download receipt
                                  toast.info('Download functionality coming soon');
                                }}
                              >
                                <Download className="me-2" />
                                Download Receipt
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDeletePayment(payment._id)}
                                disabled={deletePaymentMutation.isLoading}
                              >
                                <Trash className="me-2" />
                                Delete Payment
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
                <CreditCard size={64} className="text-muted mb-3" />
                <h6 className="text-muted">No payments found</h6>
                <p className="text-muted mb-3">
                  {filters.search || filters.status || filters.type || filters.project
                    ? 'Try adjusting your filters'
                    : 'Get started by recording your first payment'
                  }
                </p>
                <Button as={Link} to="/admin/payments/new" variant="primary">
                  <Plus className="me-2" />
                  Record Payment
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
                <h3 className="text-primary mb-1">{sortedPayments.length}</h3>
                <p className="text-muted mb-0">Total Payments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success mb-1">
                  {formatCurrency(
                    sortedPayments
                      .filter(p => p.status === 'completed')
                      .reduce((sum, p) => sum + (p.amount || 0), 0)
                  )}
                </h3>
                <p className="text-muted mb-0">Total Received</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning mb-1">
                  {formatCurrency(
                    sortedPayments
                      .filter(p => p.status === 'pending')
                      .reduce((sum, p) => sum + (p.amount || 0), 0)
                  )}
                </h3>
                <p className="text-muted mb-0">Pending Amount</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info mb-1">
                  {sortedPayments.filter(p => p.status === 'completed').length}
                </h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Payments;

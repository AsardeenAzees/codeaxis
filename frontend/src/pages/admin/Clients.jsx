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
  Person,
  Envelope,
  Phone,
  Globe,
  Building,
  Calendar
} from 'react-bootstrap-icons';
import { getClients, deleteClient } from '../../api/clients';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Clients = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedClients, setSelectedClients] = useState([]);

  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      toast.success('Client deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete client');
      console.error('Delete client error:', error);
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
      type: ''
    });
    setSortBy('newest');
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClientMutation.mutateAsync(clientId);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) {
      toast.error('Please select clients to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedClients.length} clients?`)) {
      try {
        await Promise.all(selectedClients.map(id => deleteClientMutation.mutateAsync(id)));
        setSelectedClients([]);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(clients?.map(c => c._id) || []);
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId, checked) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  // Filter and sort clients
  const filteredClients = clients?.filter(client => {
    if (filters.search && !client.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && client.status !== filters.status) {
      return false;
    }
    if (filters.type && client.type !== filters.type) {
      return false;
    }
    return true;
  }) || [];

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
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
      'active': 'success',
      'inactive': 'secondary',
      'pending': 'warning',
      'suspended': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getTypeBadgeVariant = (type) => {
    const typeMap = {
      'individual': 'info',
      'company': 'primary',
      'startup': 'warning',
      'enterprise': 'dark'
    };
    return typeMap[type] || 'secondary';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Clients - CodeAxis Admin</title>
      </Helmet>

      <div className="clients-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Clients</h1>
              <p className="text-muted mb-0">Manage your client relationships and information</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" as={Link} to="/admin/clients/new">
                <Plus className="me-2" />
                New Client
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
                    placeholder="Search clients..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="startup">Startup</option>
                  <option value="enterprise">Enterprise</option>
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
                  <option value="type">Type</option>
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
        {selectedClients.length > 0 && (
          <Card className="mb-4 border-warning">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">
                  {selectedClients.length} client(s) selected
                </span>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={deleteClientMutation.isLoading}
                  >
                    <Trash className="me-1" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSelectedClients([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Clients Table */}
        <Card>
          <Card.Body className="p-0">
            {sortedClients.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedClients.length === sortedClients.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Projects</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClients.map((client) => (
                    <motion.tr
                      key={client._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedClients.includes(client._id)}
                          onChange={(e) => handleSelectClient(client._id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {client.avatar ? (
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="client-avatar me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                          ) : (
                            <div className="client-avatar-placeholder me-3">
                              <Person size={20} />
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{client.name}</div>
                            <small className="text-muted">
                              {client.company || 'Individual Client'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          {client.email && (
                            <div className="d-flex align-items-center mb-1">
                              <Envelope size={14} className="text-muted me-2" />
                              <small>{client.email}</small>
                            </div>
                          )}
                          {client.phone && (
                            <div className="d-flex align-items-center">
                              <Phone size={14} className="text-muted me-2" />
                              <small>{client.phone}</small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getTypeBadgeVariant(client.type)}>
                          {client.type}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(client.status)}>
                          {client.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Building size={16} className="text-muted me-2" />
                          <span>{client.projectCount || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="text-muted me-2" />
                          <small>
                            {new Date(client.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            as={Link}
                            to={`/admin/clients/${client._id}`}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            as={Link}
                            to={`/admin/clients/${client._id}/edit`}
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
                                to={`/admin/clients/${client._id}`}
                              >
                                <Eye className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/clients/${client._id}/edit`}
                              >
                                <Pencil className="me-2" />
                                Edit Client
                              </Dropdown.Item>
                              {client.website && (
                                <Dropdown.Item
                                  href={client.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Globe className="me-2" />
                                  Visit Website
                                </Dropdown.Item>
                              )}
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDeleteClient(client._id)}
                                disabled={deleteClientMutation.isLoading}
                              >
                                <Trash className="me-2" />
                                Delete Client
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
                <Person size={64} className="text-muted mb-3" />
                <h6 className="text-muted">No clients found</h6>
                <p className="text-muted mb-3">
                  {filters.search || filters.status || filters.type
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first client'
                  }
                </p>
                <Button as={Link} to="/admin/clients/new" variant="primary">
                  <Plus className="me-2" />
                  Add Client
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
                <h3 className="text-primary mb-1">{sortedClients.length}</h3>
                <p className="text-muted mb-0">Total Clients</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success mb-1">
                  {sortedClients.filter(c => c.status === 'active').length}
                </h3>
                <p className="text-muted mb-0">Active</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info mb-1">
                  {sortedClients.filter(c => c.type === 'company').length}
                </h3>
                <p className="text-muted mb-0">Companies</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning mb-1">
                  {sortedClients.filter(c => c.type === 'individual').length}
                </h3>
                <p className="text-muted mb-0">Individuals</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Clients;

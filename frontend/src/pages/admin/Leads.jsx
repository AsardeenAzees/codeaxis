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
  Building,
  Calendar,
  Star,
  GeoAlt
} from 'react-bootstrap-icons';
import { getLeads, deleteLead } from '../../api/leads';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Leads = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    priority: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLeads, setSelectedLeads] = useState([]);

  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      toast.success('Lead deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete lead');
      console.error('Delete lead error:', error);
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
      source: '',
      priority: ''
    });
    setSortBy('newest');
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLeadMutation.mutateAsync(leadId);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select leads to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      try {
        await Promise.all(selectedLeads.map(id => deleteLeadMutation.mutateAsync(id)));
        setSelectedLeads([]);
      } catch (error) {
        // Error is handled in onError
      }
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLeads(leads?.map(l => l._id) || []);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  // Filter and sort leads
  const filteredLeads = leads?.filter(lead => {
    if (filters.search && !lead.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && lead.status !== filters.status) {
      return false;
    }
    if (filters.source && lead.source !== filters.source) {
      return false;
    }
    if (filters.priority && lead.priority !== filters.priority) {
      return false;
    }
    return true;
  }) || [];

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'priority':
        return a.priority.localeCompare(b.priority);
      default:
        return 0;
    }
  });

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'new': 'primary',
      'contacted': 'info',
      'qualified': 'warning',
      'proposal': 'success',
      'negotiation': 'warning',
      'closed': 'secondary',
      'lost': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getPriorityBadgeVariant = (priority) => {
    const priorityMap = {
      'low': 'secondary',
      'medium': 'warning',
      'high': 'danger',
      'urgent': 'dark'
    };
    return priorityMap[priority] || 'secondary';
  };

  const getSourceBadgeVariant = (source) => {
    const sourceMap = {
      'website': 'primary',
      'referral': 'success',
      'social_media': 'info',
      'email': 'warning',
      'phone': 'secondary',
      'other': 'dark'
    };
    return sourceMap[source] || 'secondary';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Leads - CodeAxis Admin</title>
      </Helmet>

      <div className="leads-page">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Leads</h1>
              <p className="text-muted mb-0">Manage and track potential client leads</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" as={Link} to="/admin/leads/new">
                <Plus className="me-2" />
                New Lead
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
                    placeholder="Search leads..."
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
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  <option value="">All Sources</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
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
                  <option value="priority">Priority</option>
                </Form.Select>
              </Col>
              <Col md={1}>
                <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                  <Filter className="me-1" />
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <Card className="mb-4 border-warning">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">
                  {selectedLeads.length} lead(s) selected
                </span>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={deleteLeadMutation.isLoading}
                  >
                    <Trash className="me-1" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSelectedLeads([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Leads Table */}
        <Card>
          <Card.Body className="p-0">
            {sortedLeads.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedLeads.length === sortedLeads.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Lead</th>
                    <th>Contact</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.map((lead) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedLeads.includes(lead._id)}
                          onChange={(e) => handleSelectLead(lead._id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="lead-icon me-3">
                            <Person size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold">{lead.name}</div>
                            <small className="text-muted">
                              {lead.company || 'Individual'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          {lead.email && (
                            <div className="d-flex align-items-center mb-1">
                              <Envelope size={14} className="text-muted me-2" />
                              <small>{lead.email}</small>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="d-flex align-items-center">
                              <Phone size={14} className="text-muted me-2" />
                              <small>{lead.phone}</small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getSourceBadgeVariant(lead.source)}>
                          {lead.source}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getPriorityBadgeVariant(lead.priority)}>
                          {lead.priority}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="text-muted me-2" />
                          <small>
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            as={Link}
                            to={`/admin/leads/${lead._id}`}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            as={Link}
                            to={`/admin/leads/${lead._id}/edit`}
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
                                to={`/admin/leads/${lead._id}`}
                              >
                                <Eye className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/leads/${lead._id}/edit`}
                              >
                                <Pencil className="me-2" />
                                Edit Lead
                              </Dropdown.Item>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/clients/new`}
                                state={{ fromLead: lead._id }}
                              >
                                <Person className="me-2" />
                                Convert to Client
                              </Dropdown.Item>
                              <Dropdown.Item
                                as={Link}
                                to={`/admin/projects/new`}
                                state={{ fromLead: lead._id }}
                              >
                                <Building className="me-2" />
                                Create Project
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDeleteLead(lead._id)}
                                disabled={deleteLeadMutation.isLoading}
                              >
                                <Trash className="me-2" />
                                Delete Lead
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
                <h6 className="text-muted">No leads found</h6>
                <p className="text-muted mb-3">
                  {filters.search || filters.status || filters.source || filters.priority
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first lead'
                  }
                </p>
                <Button as={Link} to="/admin/leads/new" variant="primary">
                  <Plus className="me-2" />
                  Add Lead
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
                <h3 className="text-primary mb-1">{sortedLeads.length}</h3>
                <p className="text-muted mb-0">Total Leads</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success mb-1">
                  {sortedLeads.filter(l => l.status === 'qualified').length}
                </h3>
                <p className="text-muted mb-0">Qualified</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning mb-1">
                  {sortedLeads.filter(l => l.status === 'new').length}
                </h3>
                <p className="text-muted mb-0">New</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info mb-1">
                  {sortedLeads.filter(l => l.priority === 'high' || l.priority === 'urgent').length}
                </h3>
                <p className="text-muted mb-0">High Priority</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Leads;

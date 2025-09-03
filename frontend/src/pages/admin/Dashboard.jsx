import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Folder, 
  People, 
  CreditCard, 
  Envelope, 
  GraphUp, 
  GraphDown,
  Eye,
  Plus
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/projects';
import { getSettings } from '../../api/settings';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingProjects: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    newLeads: 0
  });

  // Fetch projects data
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch settings for project statuses
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Calculate statistics when projects data changes
  useEffect(() => {
    if (projects && settings) {
      const projectStatuses = settings.projectConfiguration?.statuses || [];
      
      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => 
          projectStatuses.find(s => s.value === p.status)?.type === 'active'
        ).length,
        completedProjects: projects.filter(p => 
          projectStatuses.find(s => s.value === p.status)?.type === 'completed'
        ).length,
        pendingProjects: projects.filter(p => 
          projectStatuses.find(s => s.value === p.status)?.type === 'pending'
        ).length,
        totalClients: new Set(projects.map(p => p.client?._id)).size,
        totalRevenue: projects.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
        pendingPayments: 0, // TODO: Calculate from payments
        overduePayments: 0, // TODO: Calculate from payments
        newLeads: 0 // TODO: Calculate from leads
      };

      setStats(stats);
    }
  }, [projects, settings]);

  const StatCard = ({ title, value, icon: Icon, variant, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="stat-card h-100">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-muted mb-2">{title}</h6>
              <h3 className="mb-1">{value}</h3>
              {change && (
                <div className={`d-flex align-items-center ${changeType === 'up' ? 'text-success' : 'text-danger'}`}>
                  {changeType === 'up' ? <GraphUp size={16} /> : <GraphDown size={16} />}
                  <small className="ms-1">{change}</small>
                </div>
              )}
            </div>
            <div className={`stat-icon ${variant}`}>
              <Icon size={24} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  const RecentProject = ({ project }) => (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          {project.coverImage ? (
            <img 
              src={project.coverImage} 
              alt={project.title}
              className="project-thumb me-3"
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
            />
          ) : (
            <div className="project-thumb-placeholder me-3">
              <Folder size={20} />
            </div>
          )}
          <div>
            <div className="fw-semibold">{project.title}</div>
            <small className="text-muted">{project.client?.name}</small>
          </div>
        </div>
      </td>
      <td>
        <Badge bg={getStatusBadgeVariant(project.status)}>
          {project.status}
        </Badge>
      </td>
      <td>
        <ProgressBar 
          now={project.progress || 0} 
          variant={getProgressVariant(project.progress)}
          style={{ height: '8px' }}
        />
        <small className="text-muted">{project.progress || 0}%</small>
      </td>
      <td>
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary" as={Link} to={`/admin/projects/${project._id}`}>
            <Eye size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'planning': 'secondary',
      'in-progress': 'primary',
      'review': 'warning',
      'completed': 'success',
      'on-hold': 'info',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getProgressVariant = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'info';
  };

  if (projectsLoading) {
    return <LoadingSpinner />;
  }

  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <>
      <Helmet>
        <title>Dashboard - CodeAxis Admin</title>
      </Helmet>

      <div className="dashboard">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="text-muted mb-0">Welcome back! Here's what's happening with your projects.</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" as={Link} to="/admin/projects/new">
                <Plus className="me-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={Folder}
              variant="primary"
              change="+12%"
              changeType="up"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Projects"
              value={stats.activeProjects}
              icon={Folder}
              variant="success"
              change="+5%"
              changeType="up"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Clients"
              value={stats.totalClients}
              icon={People}
              variant="info"
              change="+3%"
              changeType="up"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Revenue"
              value={`LKR ${stats.totalRevenue.toLocaleString()}`}
              icon={CreditCard}
              variant="warning"
              change="+18%"
              changeType="up"
            />
          </Col>
        </Row>

        {/* Project Status Overview */}
        <Row className="g-4 mb-4">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Project Status Overview</h5>
                  <Button variant="link" as={Link} to="/admin/projects" size="sm">
                    View All
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col xs={6} sm={3}>
                      <div className="text-center">
                        <div className="status-circle bg-primary mb-2">
                          {stats.activeProjects}
                        </div>
                        <small className="text-muted">Active</small>
                      </div>
                    </Col>
                    <Col xs={6} sm={3}>
                      <div className="text-center">
                        <div className="status-circle bg-warning mb-2">
                          {stats.pendingProjects}
                        </div>
                        <small className="text-muted">Pending</small>
                      </div>
                    </Col>
                    <Col xs={6} sm={3}>
                      <div className="text-center">
                        <div className="status-circle bg-success mb-2">
                          {stats.completedProjects}
                        </div>
                        <small className="text-muted">Completed</small>
                      </div>
                    </Col>
                    <Col xs={6} sm={3}>
                      <div className="text-center">
                        <div className="status-circle bg-secondary mb-2">
                          {stats.totalProjects - stats.activeProjects - stats.pendingProjects - stats.completedProjects}
                        </div>
                        <small className="text-muted">Others</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" as={Link} to="/admin/projects/new" size="sm">
                      <Plus className="me-2" />
                      New Project
                    </Button>
                    <Button variant="outline-success" as={Link} to="/admin/clients/new" size="sm">
                      <People className="me-2" />
                      Add Client
                    </Button>
                    <Button variant="outline-warning" as={Link} to="/admin/payments/new" size="sm">
                      <CreditCard className="me-2" />
                      Record Payment
                    </Button>
                    <Button variant="outline-info" as={Link} to="/admin/leads" size="sm">
                      <Envelope className="me-2" />
                      View Leads
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Projects</h5>
              <Button variant="link" as={Link} to="/admin/projects" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {recentProjects.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <RecentProject key={project._id} project={project} />
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <Folder size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No projects yet</h6>
                  <p className="text-muted mb-3">Get started by creating your first project</p>
                  <Button as={Link} to="/admin/projects/new" variant="primary">
                    <Plus className="me-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;

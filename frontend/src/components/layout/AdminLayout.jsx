import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Offcanvas, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  House, 
  Folder, 
  People, 
  CreditCard, 
  Envelope, 
  Star, 
  Gear, 
  Person,
  List,
  Bell,
  Search,
  BoxArrowRight
} from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Close sidebar on route change
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      path: '/admin',
      icon: House,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/projects',
      icon: Folder,
      label: 'Projects'
    },
    {
      path: '/admin/clients',
      icon: People,
      label: 'Clients'
    },
    {
      path: '/admin/payments',
      icon: CreditCard,
      label: 'Payments'
    },
    {
      path: '/admin/leads',
      icon: Envelope,
      label: 'Leads'
    },
    {
      path: '/admin/testimonials',
      icon: Star,
      label: 'Testimonials'
    },
    {
      path: '/admin/users',
      icon: People,
      label: 'Users',
      adminOnly: true
    },
    {
      path: '/admin/settings',
      icon: Gear,
      label: 'Settings',
      adminOnly: true
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const canAccessItem = (item) => {
    if (!item.adminOnly) return true;
    return user?.role === 'main_admin';
  };

  return (
    <>
      <Helmet>
        <title>{title} - CodeAxis Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-layout">
        {/* Sidebar */}
        <motion.div 
          className={`admin-sidebar ${showSidebar ? 'show' : ''}`}
          initial={{ x: -280 }}
          animate={{ x: showSidebar ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="sidebar-header">
            <h5 className="mb-0">CodeAxis</h5>
            <p className="text-muted small mb-0">Admin Panel</p>
          </div>

          <Nav className="flex-column sidebar-nav">
            {navigationItems
              .filter(canAccessItem)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className={`sidebar-nav-link ${isActiveRoute(item.path, item.exact) ? 'active' : ''}`}
                  >
                    <Icon className="me-2" />
                    {item.label}
                  </Nav.Link>
                );
              })}
          </Nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <Person size={24} />
                )}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">
                  <Badge bg={user?.role === 'main_admin' ? 'primary' : 'secondary'}>
                    {user?.role === 'main_admin' ? 'Main Admin' : 'Admin'}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="logout-btn"
            >
              <BoxArrowRight className="me-1" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="admin-main">
          {/* Top Header */}
          <Navbar className="admin-header" expand="lg">
            <Container fluid>
              <Button
                variant="outline-secondary"
                onClick={() => setShowSidebar(!showSidebar)}
                className="sidebar-toggle d-lg-none"
              >
                <List />
              </Button>

              <Navbar.Brand className="d-none d-lg-block">
                <h4 className="mb-0">{title}</h4>
              </Navbar.Brand>

              <div className="ms-auto d-flex align-items-center">
                {/* Search */}
                <div className="search-box me-3">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control"
                  />
                </div>

                {/* Notifications */}
                <Dropdown className="me-3">
                  <Dropdown.Toggle variant="outline-secondary" className="position-relative">
                    <Bell />
                    {unreadCount > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.6rem' }}
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <Dropdown.Item key={notification.id}>
                          {notification.message}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>No notifications</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                {/* User Menu */}
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    <div className="d-flex align-items-center">
                      <div className="user-avatar-sm me-2">
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt={user.name} />
                        ) : (
                          <Person size={16} />
                        )}
                      </div>
                      <span className="d-none d-md-block">{user?.name}</span>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/admin/profile">
                      <Person className="me-2" />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <BoxArrowRight className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Container>
          </Navbar>

          {/* Page Content */}
          <div className="admin-content">
            <Container fluid>
              {children}
            </Container>
          </div>
        </div>

        {/* Overlay for mobile */}
        {showSidebar && (
          <div 
            className="sidebar-overlay"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar as BootstrapNavbar, Offcanvas, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { List, X } from 'react-bootstrap-icons';

const Navbar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close offcanvas on route change
  useEffect(() => {
    setShowOffcanvas(false);
  }, [location.pathname]);

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
    { path: '/hire-us', label: 'Hire Us' }
  ];

  return (
    <BootstrapNavbar
      expand="lg"
      className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}
      fixed="top"
    >
      <Container>
        {/* Logo */}
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="brand-text">CodeAxis</span>
          </motion.div>
        </BootstrapNavbar.Brand>

        {/* Mobile Toggle */}
        <Button
          variant="outline-light"
          className="navbar-toggler d-lg-none"
          onClick={() => setShowOffcanvas(true)}
        >
          <List />
        </Button>

        {/* Desktop Navigation */}
        <BootstrapNavbar.Collapse className="d-none d-lg-block">
          <Nav className="ms-auto">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Nav.Link>
            ))}
            <Button
              variant="outline-light"
              as={Link}
              to="/hire-us"
              className="ms-3"
            >
              Get Started
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>

        {/* Mobile Offcanvas */}
        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="end"
          className="navbar-offcanvas"
        >
          <Offcanvas.Header>
            <Offcanvas.Title>Menu</Offcanvas.Title>
            <Button
              variant="link"
              className="btn-close-white"
              onClick={() => setShowOffcanvas(false)}
            >
              <X />
            </Button>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  onClick={() => setShowOffcanvas(false)}
                >
                  {item.label}
                </Nav.Link>
              ))}
              <div className="mt-3">
                <Button
                  variant="primary"
                  as={Link}
                  to="/hire-us"
                  className="w-100"
                  onClick={() => setShowOffcanvas(false)}
                >
                  Get Started
                </Button>
              </div>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

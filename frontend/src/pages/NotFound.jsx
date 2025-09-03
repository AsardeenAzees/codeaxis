import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { House, ArrowLeft } from 'react-bootstrap-icons';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - CodeAxis</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="not-found-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={8} lg={6} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* 404 Icon */}
                <div className="not-found-icon mb-4">
                  <h1 className="display-1 fw-bold text-muted">404</h1>
                </div>

                {/* Error Message */}
                <h2 className="h3 fw-bold mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                  Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                </p>

                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <Button variant="primary" as={Link} to="/">
                    <House className="me-2" />
                    Go Home
                  </Button>
                  <Button variant="outline-secondary" onClick={() => window.history.back()}>
                    <ArrowLeft className="me-2" />
                    Go Back
                  </Button>
                </div>

                {/* Helpful Links */}
                <div className="helpful-links">
                  <p className="text-muted small mb-2">You might also be looking for:</p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/portfolio" className="text-decoration-none">
                      Portfolio
                    </Link>
                    <Link to="/contact" className="text-decoration-none">
                      Contact Us
                    </Link>
                    <Link to="/hire-us" className="text-decoration-none">
                      Hire Us
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default NotFound;

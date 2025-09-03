import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Envelope, CreditCard, ArrowLeft } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email/nic, 2: OTP, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    nic: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (formData.nic.length < 10) {
      newErrors.nic = 'Please enter a valid NIC';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement API call to send OTP
      // await forgotPassword(formData.email, formData.nic);
      
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      console.error('Forgot password error:', error);
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (error.response?.status === 404) {
        setErrors({ general: 'No account found with this email and NIC combination.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement API call to verify OTP
      // await verifyOTP(formData.email, formData.nic, formData.otp);
      
      toast.success('OTP verified successfully!');
      setStep(3);
    } catch (error) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'OTP verification failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (error.response?.status === 400) {
        setErrors({ otp: 'Invalid OTP. Please check and try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement API call to reset password
      // await resetPassword(formData.email, formData.nic, formData.otp, formData.newPassword);
      
      toast.success('Password reset successfully!');
      
      // Redirect to login
      // navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement API call to resend OTP
      // await resendOTP(formData.email, formData.nic);
      
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Form onSubmit={handleStep1Submit}>
      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <div className="input-group">
          <span className="input-group-text">
            <Envelope />
          </span>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            isInvalid={!!errors.email}
            disabled={isLoading}
          />
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>NIC Number</Form.Label>
        <div className="input-group">
          <span className="input-group-text">
            <CreditCard />
          </span>
          <Form.Control
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            placeholder="Enter your NIC number"
            isInvalid={!!errors.nic}
            disabled={isLoading}
          />
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.nic}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid mb-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="auth-btn"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </Button>
      </div>
    </Form>
  );

  const renderStep2 = () => (
    <Form onSubmit={handleStep2Submit}>
      <div className="text-center mb-4">
        <p className="text-muted">
          We've sent a 6-digit OTP to <strong>{formData.email}</strong>
        </p>
      </div>

      <Form.Group className="mb-4">
        <Form.Label>Enter OTP</Form.Label>
        <Form.Control
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          isInvalid={!!errors.otp}
          disabled={isLoading}
          className="text-center"
          style={{ fontSize: '1.2rem', letterSpacing: '0.5rem' }}
        />
        <Form.Control.Feedback type="invalid">
          {errors.otp}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid mb-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="auth-btn"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="link"
          onClick={resendOTP}
          disabled={isLoading}
          className="text-decoration-none"
        >
          Didn't receive OTP? Resend
        </Button>
      </div>
    </Form>
  );

  const renderStep3 = () => (
    <Form onSubmit={handleStep3Submit}>
      <div className="text-center mb-4">
        <p className="text-muted">
          Create a new password for your account
        </p>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>New Password</Form.Label>
        <div className="input-group">
          <span className="input-group-text">
            <Lock />
          </span>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            isInvalid={!!errors.newPassword}
            disabled={isLoading}
          />
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.newPassword}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Password must be at least 8 characters long
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Confirm New Password</Form.Label>
        <div className="input-group">
          <span className="input-group-text">
            <Lock />
          </span>
          <Form.Control
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            isInvalid={!!errors.confirmPassword}
            disabled={isLoading}
          />
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid mb-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="auth-btn"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </div>
    </Form>
  );

  return (
    <>
      <Helmet>
        <title>Forgot Password - CodeAxis Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="auth-page">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="auth-card shadow-lg">
                  <Card.Body className="p-5">
                    {/* Header */}
                    <div className="text-center mb-4">
                      <div className="auth-logo mb-3">
                        <h2 className="text-primary fw-bold">CodeAxis</h2>
                      </div>
                      <h4 className="text-dark mb-2">Reset Password</h4>
                      <p className="text-muted">
                        {step === 1 && 'Enter your email and NIC to receive OTP'}
                        {step === 2 && 'Enter the OTP sent to your email'}
                        {step === 3 && 'Create a new password for your account'}
                      </p>
                    </div>

                    {/* Back Button */}
                    {step > 1 && (
                      <div className="mb-3">
                        <Button
                          variant="link"
                          onClick={() => setStep(step - 1)}
                          className="text-decoration-none p-0"
                        >
                          <ArrowLeft className="me-1" />
                          Back
                        </Button>
                      </div>
                    )}

                    {/* Error Alert */}
                    {errors.general && (
                      <Alert variant="danger" className="mb-3">
                        {errors.general}
                      </Alert>
                    )}

                    {/* Progress Steps */}
                    <div className="progress-steps mb-4">
                      <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Verify</div>
                      </div>
                      <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                      <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">OTP</div>
                      </div>
                      <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                      <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Reset</div>
                      </div>
                    </div>

                    {/* Form Steps */}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    {/* Footer */}
                    <div className="text-center mt-4 pt-3 border-top">
                      <Link 
                        to="/login" 
                        className="text-decoration-none"
                      >
                        Back to Login
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ForgotPassword;

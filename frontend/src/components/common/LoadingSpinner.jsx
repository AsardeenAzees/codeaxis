import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', className = '', text = 'Loading...' }) => {
  return (
    <div className={`d-flex justify-content-center align-items-center min-vh-100 ${className}`}>
      <div className="text-center">
        <Spinner
          animation="border"
          role="status"
          size={size}
          className="mb-3"
        >
          <span className="visually-hidden">{text}</span>
        </Spinner>
        <p className="text-muted mb-0">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

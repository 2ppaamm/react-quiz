import React from 'react';
import { useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const { message } = location.state || {}; // Extract the error message from state

  return (
    <div>
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPage;
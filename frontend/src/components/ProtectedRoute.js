// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    // Nuk je i kyçur
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nuk ke rol të lejuar
    return <Navigate to="/" replace />;
  }

  // Je i kyçur dhe ke rol të duhur
  return children;
};

export default PrivateRoute;

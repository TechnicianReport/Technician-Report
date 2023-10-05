import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from './firebase'; // Replace with the actual path to your authentication file

function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuthState(); // Use your authentication hook

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
}

export default PrivateRoute;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Step 1: Import ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* The Login route is public */}
        <Route path="/login" element={<Login />} />

        {/* The Dashboard route is now protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute> {/* Step 2: Wrap the Dashboard component */}
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any other path to the login page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
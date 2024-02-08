import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SlotForm from './SlotForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './LoginPage';
import { AuthProvider } from './AuthContext'; 
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="774141818727-2k7igjlh0q78585k8v3ebpiva6n0l3co.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/bookslot" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/bookslot" element={
              <ProtectedRoute>
                <SlotForm />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

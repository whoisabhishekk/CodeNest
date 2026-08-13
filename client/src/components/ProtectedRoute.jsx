import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ===== PROTECTED ROUTE =====
// Yeh component ensure karega ki sirf logged-in users hi specific pages dekh sakein.
// Agar user login nahi hai, toh use wapas /login page par bhej dega.

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        // Agar user logged in nahi hai toh redirect kardo
        return <Navigate to="/login" replace />;
    }

    // Agar logged in hai toh child component dikhao
    return children;
};

export default ProtectedRoute;

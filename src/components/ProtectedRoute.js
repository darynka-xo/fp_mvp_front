// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // If no specific role is required, allow access
    if (!requiredRole) {
        return children;
    }

    // If a specific role is required, check if user has that role
    if (requiredRole && role !== requiredRole) {
        // Always redirect to Orders Registry for any unauthorized access
        return <Navigate to="/orders-registry" />;
    }

    return children;
};
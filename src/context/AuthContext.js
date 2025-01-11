import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('username');
    });

    const [role, setRole] = useState(() => {
        return localStorage.getItem('role') || null;
    });

    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || null;
    });

    const login = (userData) => {
        localStorage.setItem('username', userData.username);
        localStorage.setItem('role', userData.role);
        setIsAuthenticated(true);
        setRole(userData.role);
        setUsername(userData.username);
    };

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            role,
            username
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
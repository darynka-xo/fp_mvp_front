// Navbar.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { logout, isAuthenticated, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getNavItems = () => {
        if (role === 'Chief Tech') {
            return [
                { path: '/catalog', label: 'Каталог' },
                { path: '/orders-registry', label: 'Реестр заказов' },
                { path: '/tech-cards', label: 'Техкарты' },
                { path: '/tech-specifications', label: 'Технические спецификации' },
                { path: '/user-approval', label: 'Утверждение пользователей' },
                { path: '/register', label: 'Регистрация' }
            ];
        } else if (role === 'Sales Manager') {
            return [
                { path: '/orders-registry', label: 'Реестр заказов' }
            ];
        }
        return [];
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип - ссылка на реестр заказов */}
                    {(role === 'Chief Tech' || role === 'Sales Manager') && (
                        <Link to="/orders-registry" className="flex items-center">
                            <img src="/logo.png" alt="Логотип ERP системы" className="h-8 w-auto" />
                        </Link>
                    )}

                    {/* Навигационные ссылки */}
                    {isAuthenticated && role === 'Chief Tech' && (
                        <div className="hidden md:flex items-center space-x-4">
                            {getNavItems().map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Меню пользователя - отображается для обеих ролей */}
                    {isAuthenticated && (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <User className="h-6 w-6" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
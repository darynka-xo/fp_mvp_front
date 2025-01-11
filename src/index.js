import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TableView from "./components/TableView";
import CatalogPage from "./components/CatalogPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UserApprovalPage from "./components/UserApprovalPage";
import OrderRegistryPage from "./components/OrderRegistryPage";
import TechCardsPage from "./components/TechCardsPage";
import TechCardViewPage from "./components/TechCardViewPage";
import TechSpecPage from "./components/TechSpecPage";
import "./index.css";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Routes>
                                        {/* Default route/redirect */}
                                        <Route path="/" element={<Navigate to="/orders-registry" replace />} />

                                        {/* Orders Registry - accessible to all roles */}
                                        <Route path="/orders-registry" element={<OrderRegistryPage />} />

                                        {/* Routes protected for Chief Tech only */}
                                        <Route
                                            path="/catalog"
                                            element={
                                                <ProtectedRoute requiredRole="Chief Tech">
                                                    <CatalogPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/tech-cards"
                                            element={
                                                <ProtectedRoute requiredRole="Chief Tech">
                                                    <TechCardsPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/techcards/view/:orderNumber"
                                            element={
                                                <ProtectedRoute requiredRole="Chief Tech">
                                                    <TechCardViewPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/tech-specifications"
                                            element={
                                                <ProtectedRoute requiredRole="Chief Tech">
                                                    <TechSpecPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/user-approval"
                                            element={
                                                <ProtectedRoute requiredRole="Chief Tech">
                                                    <UserApprovalPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/register-user"
                                            element={
                                                <ProtectedRoute requiredRole="Chief Tech">
                                                    <Register />
                                                </ProtectedRoute>
                                            }
                                        />

                                        {/* Redirect dashboard to orders-registry */}
                                        <Route
                                            path="/dashboard"
                                            element={<Navigate to="/orders-registry" replace />}
                                        />

                                        {/* Catch-all redirect */}
                                        <Route path="*" element={<Navigate to="/orders-registry" replace />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
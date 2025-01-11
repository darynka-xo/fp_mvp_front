import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Link} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await loginUser({
                username: username,
                password: password
            });
            if (response.data) {
                login(response.data);
                navigate('/orders-registry');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                setError(error.response.data.message || "Аккаунт ожидает одобрения");
            } else {
                setError("Не удалось войти. Пожалуйста, проверьте учетные данные.");
            }
        }
    };

    return (
        <div className="container mx-auto mt-8 max-w-md">
            {/* Logo Container */}
            <div className="flex justify-center mb-8">
                <img
                    src="/logo.png"
                    alt="Company Logo"
                    className="h-16 w-auto"
                />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Войти
                    </button>
                </form>

                {/* Registration Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Вы у нас впервые?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Зарегистрируйтесь
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
// Register.js
import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { role: currentUserRole } = useAuth(); // Переименовано в currentUserRole для ясности
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Chief Tech", // Это роль нового пользователя, который регистрируется
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        try {
            const { username, email, password, role } = formData;
            const response = await registerUser({
                username,
                email,
                password,
                role,
                isChiefTechRegistering: currentUserRole === 'Chief Tech', // Используем currentUserRole здесь
            });

            alert(response.data.message);

            // Используем currentUserRole для навигации
            if (currentUserRole === 'Chief Tech') {
                navigate('/user-approval');
            } else {
                navigate('/');
            }
        } catch (error) {
            alert("Регистрация не удалась. Пожалуйста, проверьте введенные данные.");
        }
    };

    return (
        <div className="container">
            <h1 className="text-center mt-4">
                Регистрация {currentUserRole === 'Chief Tech' ? 'нового пользователя' : ''}
            </h1>
            <form onSubmit={handleSubmit} className="user">
                <div className="form-group">
                    <label>Имя пользователя</label>
                    <input
                        type="text"
                        className="form-control form-control-user"
                        placeholder="Имя пользователя"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Электронная почта</label>
                    <input
                        type="email"
                        className="form-control form-control-user"
                        placeholder="Электронная почта"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Роль</label>
                    <select
                        className="form-control form-control-user"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                    >
                        <option value="Chief Tech">Chief Tech</option>
                        <option value="Sales Manager">Sales Manager</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        className="form-control form-control-user"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Подтвердите пароль</label>
                    <input
                        type="password"
                        className="form-control form-control-user"
                        placeholder="Подтвердите пароль"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                </div>
                <button className="btn btn-primary btn-user btn-block">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
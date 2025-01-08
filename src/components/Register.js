import React, { useState } from "react";
import { registerUser } from "../services/api";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "User",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            alert(response.data.message);
        } catch (error) {
            alert("Registration failed.");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="user">
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control form-control-user"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control form-control-user"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button className="btn btn-primary btn-user btn-block">Register</button>
            </form>
        </div>
    );
};

export default Register;
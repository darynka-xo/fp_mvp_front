import React, { useState } from "react";
import { loginUser } from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username: email, password });
            alert(response.data.message);
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="user">
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control form-control-user"
                        placeholder="Enter Email Address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control form-control-user"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary btn-user btn-block">Login</button>
            </form>
        </div>
    );
};

export default Login;
import React from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Navbar />
                    <div className="container-fluid">
                        <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>
                        <p>Welcome to the ERP System Dashboard!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
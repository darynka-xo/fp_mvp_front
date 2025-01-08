import React from "react";

const Sidebar = () => (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
            <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink"></i>
            </div>
            <div className="sidebar-brand-text mx-3">ERP System</div>
        </a>
        <hr className="sidebar-divider my-0" />
        <li className="nav-item">
            <a className="nav-link" href="/dashboard">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
            </a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/tables">
                <i className="fas fa-fw fa-table"></i>
                <span>Tables</span>
            </a>
        </li>
    </ul>
);

export default Sidebar;
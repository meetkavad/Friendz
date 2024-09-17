import React from "react";
import "./MainNav.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <h1>Friendz</h1>
        </div>

        <div className="nav-links">
          <div
            className="nav-item"
            onClick={() => navigate("/Friendz/v1/home")}
          >
            Friends
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/Friendz/v1/search")}
          >
            Search
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/Friendz/v1/request")}
          >
            Requests
          </div>
          <div
            className="nav-item"
            onClick={() => navigate("/Friendz/v1/profile")}
          >
            Profile
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

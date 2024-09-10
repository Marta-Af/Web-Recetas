import "../scss/App.scss";
import Logo from "./images/Logo.jpg";
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="container_header">
      <div className="logo-container">
        <img className="image" src={Logo} title="Logo" alt="Mis recetas" />
      </div>
      <div className="nav-links">
        <nav>
          <ul>
            <li>
              <Link to="/Login" className="nav-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/Register" className="nav-link">
                Registrate
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

import React from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

export default function TopBar(props) {
  const curTheme = props.curTheme;
  return (
    <div>
      <nav
        className={
          "navbar navbar-expand-lg fixed-top " +
          (curTheme === "light"
            ? "navbar-light bg-light"
            : "navbar-dark bg-dark")
        }
      >
        <Link to="/" className="navbar-brand">
          vjsbin
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="navbar-item"></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BottomBar(props) {
  const curTheme = props.curTheme;
  return (
    <div>
      <nav
        className={
          "navbar navbar-expand-lg fixed-bottom " +
          (curTheme === "light"
            ? "navbar-light bg-light"
            : "navbar-dark bg-dark")
        }
      >
        <Link to="/" className="navbar-brand">
          {" "}
          <small>&copy; Copyright 2023, StagBIN</small>{" "}
        </Link>
      </nav>
    </div>
  );
}

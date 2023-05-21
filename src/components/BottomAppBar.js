import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import ReportBug from "./ReportBug";

const useStyles = makeStyles(() => ({
  appBar: {
    bottom: 0,
    top: "auto",
  },
  toolbar: {
    minHeight: "30px",
  },
  reportBug: {
    position: "absolute",
    right: 20,
    cursor: "pointer",
    fontSize: 12,
  },
}));

export default function BottomAppBar(props) {
  const curTheme = props.curTheme;
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{
          background: curTheme === "light" ? "white" : "#363537",
          color: "inherit",
          zIndex: 999,
        }}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <a href="https://stagbin.tk" style={{ color: "inherit" }}>
            <h4 style={{ margin: 0, fontSize: 14 }}>
              &copy; Copyright 2023, StagBIN
            </h4>
          </a>
          <div style={{ margin: "8px" }}>
            <a href="https://github.com/StagBin" style={{ color: "inherit" }}>
              <h4 style={{ margin: 0, fontSize: 14 }}>Source</h4>
            </a>
          </div>

          <div className={classes.reportBug}>
            <ReportBug />
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

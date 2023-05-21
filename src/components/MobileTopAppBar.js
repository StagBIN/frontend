import { React, useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import makeStyles from "@mui/styles/makeStyles";
import { useTheme } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import FormControl from "@mui/material/FormControl";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";

// Logo
import logo from "../assets/images/logo.png";

// Context
import { StagBinContext } from "../App";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    bottom: useTheme().spacing(1),
    right: useTheme().spacing(2),
    minHeight: "10px",
    zIndex: 9999,
  },
  centerItems: {
    justifyContent: "space-between",
  },
  urlEdit: {
    justifyContent: "center",
    marginLeft: "500px",
    paddingBottom: "15px",
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

export default function BackToTop(props) {
  const {
    theme: curTheme,
    readOnly,
    invokeSave,
    isSameContentbuid,
    base_url,
    setReadOnly,
    setEdited,
    data,
  } = useContext(StagBinContext);

  const classes = useStyles();
  // console.log(readOnly);
  return (
    <div>
      {" "}
      <CssBaseline />
      <AppBar
        style={{
          background: curTheme === "light" ? "white" : "#363537",
          color: "inherit",
          zIndex: 999,
        }}
      >
        <Toolbar className={classes.centerItems}>
          <a
            href={base_url}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <img src={logo} alt={"StagBIN"} style={{ width: "100px" }} />
          </a>
          <FormControl
            style={{
              marginLeft: "30px",
              marginTop: "0",
            }}
          ></FormControl>
          <div style={{ display: "inline-flex" }}>
            {readOnly ? (
              isSameContentbuid ? (
                <Tooltip title="Edit">
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="Save"
                    onClick={() => {
                      console.log(data);
                      setEdited(true);
                      setReadOnly(false);
                      console.log(readOnly);
                    }}
                    size="large"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )
            ) : (
              <Tooltip title="Save">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Save"
                  onClick={invokeSave}
                  size="large"
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="New Paste">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="Save"
                onClick={() => {
                  window.location.href = base_url;
                }}
                size="large"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
}

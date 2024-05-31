import { React, useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FormControl from "@material-ui/core/FormControl";
import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

// Logo
import logo from "../assets/images/logo.png";

// Context
import { StagBinContext } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(1),
    right: theme.spacing(2),
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
    expirationTime,
    setReadOnly,
    setEdited,
    setExpirationTime,
    data,
    encrypted,
    setOpenPasswordDialog,
  } = useContext(StagBinContext);

  const showLockIcon = !readOnly && !encrypted;
  const showUnlockIcon = readOnly && encrypted;

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
          {!readOnly && (
            <FormControl className={classes.formControl}>
              <InputLabel
                style={{ color: "inherit" }}
                id="expiration-time-label"
              >
                Expire in
              </InputLabel>
              <Select
                labelId="expiration-time-label"
                id="expiration-time-select"
                style={{ color: "inherit" }}
                value={expirationTime}
                aria-label="Select Expiration Time"
                onChange={(event) => setExpirationTime(event.target.value)}
              >
                <MenuItem value={false}>Never</MenuItem>
                <MenuItem value={3600}>1 Hour</MenuItem>
                <MenuItem value={86400}>1 Day</MenuItem>
                <MenuItem value={604800}>1 Week</MenuItem>
                <MenuItem value={2592000}>1 Month</MenuItem>
              </Select>
            </FormControl>
          )}
          <div style={{ display: "inline-flex" }}>
            {showLockIcon && (
              <Tooltip title="Encrypt">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Save"
                  onClick={() => {
                    setOpenPasswordDialog(true);
                  }}
                >
                  <LockIcon />
                </IconButton>
              </Tooltip>
            )}
            {showUnlockIcon && (
              <Tooltip title="Decrypt">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Save"
                  onClick={() => {
                    setOpenPasswordDialog(true);
                  }}
                >
                  <LockOpenIcon />
                </IconButton>
              </Tooltip>
            )}
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

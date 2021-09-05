import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import { Button } from "@material-ui/core";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
// import FileCopyIcon from "@material-ui/icons/FileCopy";
import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import InputAdornment from "@material-ui/core/InputAdornment";
import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
// import Input from "@material-ui/core/Input";

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
  const curTheme = props.curTheme;
  // const isEditing = props.isEditing;
  // 0 = white, 1 = dark
  const [icon, setIcon] = useState(curTheme === "dark");
  // const [url, setUrl] = [props.url, props.setUrl];
  const readOnly = props.readOnly;
  const invokeSave = props.invokeSave;
  const isSameContentbuid = props.isSameContentbuid;
  const base_url = props.base_url;
  const setReadOnly = props.setReadOnly;
  const setEdited = props.setEdited;
  const data = props.data;

  const classes = useStyles();
  // console.log(readOnly);
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        style={{
          background: curTheme === "light" ? "white" : "#363537",
          color: "inherit",
          zIndex: 999,
        }}
      >
        <Toolbar className={classes.centerItems}>
          <Typography variant="h6">StagBIN</Typography>
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
            <Button
              color="inherit"
              onClick={() => {
                props.toggle();
                setIcon(!icon);
              }}
            >
              {icon ? <WbSunnyIcon /> : <NightsStayIcon />}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}

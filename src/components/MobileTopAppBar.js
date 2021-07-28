import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(1),
    right: theme.spacing(2),
    minHeight: "10px",
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

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

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
  const [url, setUrl] = [props.url, props.setUrl];
  const readOnly = props.readOnly;
  const invokeSave = props.invokeSave;

  const classes = useStyles();
  console.log(readOnly);
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar style={{ background: "inherit", color: "inherit" }}>
        <Toolbar className={classes.centerItems}>
          <Typography variant="h6">StagBIN</Typography>
          <FormControl
            style={{
              marginLeft: "30px",
              marginTop: "0",
            }}
          >
            <InputLabel htmlFor="custom-url">URL</InputLabel>
            <Input
              id="custom-url"
              disabled={readOnly ? true : false}
              type="text"
              value={url}
              onChange={(e) => {
                console.log(e.target.value);
                setUrl(e.target.value);
              }}
              style={{ color: "inherit", width: "50%" }}
              endAdornment={
                readOnly ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="cop"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "https://stagbin.tk/" + url
                        );
                      }}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ""
                )
              }
            />
          </FormControl>
          <div style={{ display: "inline-flex" }}>
            <FormControl className={classes.margin}>
              <InputLabel id="demo-customized-select-label">Option</InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                // value={}
                onChange={(event) => {
                  switch (event.target.value) {
                    case "save":
                      invokeSave();
                      break;
                    case "new":
                      window.location.href = "https://stagbin.tk";
                      break;
                    case "edit":
                      break;
                    default:
                      break;
                  }
                }}
                input={<BootstrapInput />}
              >
                {readOnly ? (
                  <MenuItem value="edit">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EditIcon />
                      <div>Edit</div>
                    </div>
                  </MenuItem>
                ) : (
                  <MenuItem value="save">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <SaveIcon />
                      <div>Save</div>
                    </div>
                  </MenuItem>
                )}
                <MenuItem value="new">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <AddIcon />
                    <div>New</div>
                  </div>
                </MenuItem>
              </Select>
            </FormControl>
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

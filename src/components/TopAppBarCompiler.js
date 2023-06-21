import { React, useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import CodeIcon from "@material-ui/icons/Code";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Tooltip from "@material-ui/core/Tooltip";
import Swal from "sweetalert2";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// Logo
import logo from "../assets/images/logo.png";

// Compiler
import compiler from "../utils/compiler";

// Context
import { StagBinContext } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(1),
    right: theme.spacing(2),
    minHeight: "10px",
    zIndex: 99999,
  },
  centerItems: {
    justifyContent: "space-between",
  },
  urlEdit: {
    justifyContent: "center",
    marginLeft: "500px",
    paddingBottom: "15px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: "-5px",
    color: "inherit",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
    compileMode,
    language,
    setLanguage,
    base_url,
    setCompileMode,
    data,
    setOutput,
  } = useContext(StagBinContext);

  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <AppBar
        style={{
          background: curTheme === "light" ? "white" : "#363537",
          color: "inherit",
        }}
      >
        <Toolbar className={classes.centerItems}>
          <a
            href={base_url}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <img src={logo} alt={"StagBIN"} style={{ width: "100px" }} />
            {/* <Typography variant="h6">StagBIN</Typography> */}
          </a>
          <div>
            <Tooltip title="Run">
              <IconButton
                aria-label="run"
                color="inherit"
                onClick={async () => {
                  // if code is empty, don't run
                  if (data === "") {
                    Swal.fire({
                      icon: "warning",
                      title: "Oops...",
                      text: "Code is empty!",
                      toast: true,
                      position: "center-end",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  } else {
                    const temp_output = await compiler(data, language);
                    setOutput(temp_output);
                  }
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Disable Compile Mode">
              <IconButton
                aria-label="compile"
                color="inherit"
                onClick={() => {
                  setCompileMode(!compileMode);
                }}
              >
                <CodeIcon />
              </IconButton>
            </Tooltip>

            <FormControl className={classes.formControl}>
              <InputLabel
                style={{ color: "inherit" }}
                id="demo-simple-select-label-compiler"
              >
                Language
              </InputLabel>
              <Select
                labelId="demo-simple-select-label-compiler"
                id="demo-simple-select-compiler"
                style={{ color: "inherit" }}
                value={language}
                aria-label="Select Language"
                onChange={(event) => {
                  setLanguage(event.target.value);
                }}
              >
                <MenuItem value="python">Python</MenuItem>
              </Select>
            </FormControl>
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

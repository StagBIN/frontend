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
import CodeIcon from "@mui/icons-material/Code";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Logo
import logo from "../assets/images/logo.png";

// Compiler
import compiler from "../utils/compiler";

// Context
import { StagBinContext } from "../App";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    bottom: useTheme().spacing(1),
    right: useTheme().spacing(2),
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
    margin: useTheme().spacing(1),
    minWidth: 120,
    marginTop: "-5px",
    color: "inherit",
  },
  selectEmpty: {
    marginTop: useTheme().spacing(2),
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
                size="large"
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
                size="large"
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

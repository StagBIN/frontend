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
import CodeIcon from "@mui/icons-material/Code";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RawOnIcon from "@mui/icons-material/RawOn";
import Input from "@mui/material/Input";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import MarkdownIcon from "./icons/MarkdownIcon";
import VSCodeDiffIcon from "./icons/VSCodeDiffIcon";

// Logo
import logo from "../assets/images/logo.png";

// Context
import { StagBinContext } from "../App";
import { RAW_URL } from "../Constants";

const useStyles = makeStyles((theme) => ({
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
    url,
    compileMode,
    encrypted,
    encryptedReadOnly,
    setUrl,
    readOnly,
    invokeSave,
    language,
    setLanguage,
    isMarkdownView,
    updateIsMarkdownView,
    isSameContentbuid,
    base_url,
    setReadOnly,
    isDiff,
    setCompileMode,
    setIsDiff,
    edited,
    setEdited,
    data,
    setOldData,
    setOpenPasswordDialog,
  } = useContext(StagBinContext);

  const classes = useStyles();

  const showCustomUrl = true;
  const showBinLanguages = true;
  const showNewIcon = true; // Will update when we allow managing sessions for compilers
  const showDownload = readOnly; // Will update when we allow managing sessions for compilers
  const showMarkdown = language === "markdown";
  const showDiffIcon = edited && !encryptedReadOnly;
  const showEditIcon = readOnly && isSameContentbuid && !encrypted;
  const showRawIcon = readOnly && !encrypted;
  const showSaveIcon =
    // When it is not encrypted and not read only
    // When it is encrypted but not read only and encryptedReadOnly
    (!encrypted && !readOnly) || (encrypted && !readOnly && encryptedReadOnly);
  const showCompilerIcon = !readOnly;
  const showLockIcon = !readOnly && !encrypted;
  const showUnlockIcon = readOnly && encrypted;

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
          {showCustomUrl && (
            <FormControl>
              <InputLabel style={{ color: "inherit" }} htmlFor="custom-url">
                URL
              </InputLabel>
              <Input
                id="custom-url"
                type="text"
                disabled={readOnly || edited ? true : false}
                value={url}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setUrl(e.target.value);
                }}
                style={{ color: "inherit" }}
                endAdornment={
                  readOnly && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="cop"
                        color="inherit"
                        onClick={() => {
                          navigator.clipboard.writeText(base_url + "/" + url);
                        }}
                        size="large"
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>
          )}
          <div>
            {showRawIcon && (
              <Tooltip title="Raw">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Raw"
                  onClick={() => {
                    // Redirect to raw
                    window.location.href = `${RAW_URL}${url}`;
                  }}
                  size="large"
                >
                  <RawOnIcon />
                </IconButton>
              </Tooltip>
            )}
            {showCompilerIcon && (
              <Tooltip title="Enable Compile Mode">
                <IconButton
                  aria-label="compile"
                  color="primary"
                  onClick={() => {
                    setCompileMode(!compileMode);
                  }}
                  size="large"
                >
                  <CodeIcon />
                </IconButton>
              </Tooltip>
            )}
            {showLockIcon && (
              <Tooltip title="Encrypt">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Save"
                  onClick={() => {
                    setOpenPasswordDialog(true);
                  }}
                  size="large"
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
                  size="large"
                >
                  <LockOpenIcon />
                </IconButton>
              </Tooltip>
            )}
            {showBinLanguages && (
              <FormControl className={classes.formControl}>
                <InputLabel
                  style={{ color: "inherit" }}
                  id="demo-simple-select-label"
                >
                  Language
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ color: "inherit" }}
                  value={language}
                  aria-label="Select Language"
                  onChange={(event) => {
                    setLanguage(event.target.value);
                  }}
                >
                  <MenuItem value="markdown">Markdown</MenuItem>
                  <MenuItem style={{ color: "inherit" }} value="javascript">
                    Javascript
                  </MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="go">Go Lang</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                  <MenuItem value="css">CSS</MenuItem>
                  <MenuItem value="cpp">C/C++</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                </Select>
              </FormControl>
            )}

            {showDownload && (
              <Tooltip title={"Download Contents"}>
                <IconButton
                  style={{ marginTop: "5px" }}
                  edge="end"
                  color="inherit"
                  aria-label="Dowmload Contents"
                  onClick={() => {
                    const element = document.createElement("a");
                    element.style.display = "none";
                    const file = new Blob([data], { type: "text/plain" });
                    element.href = URL.createObjectURL(file);
                    element.download = url;
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                  }}
                  size="large"
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            )}
            {showMarkdown && (
              <Tooltip title={"Markdown " + (readOnly ? "View" : "Preview")}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Markdown Preview"
                  onClick={() => {
                    updateIsMarkdownView(!isMarkdownView);
                  }}
                  size="large"
                >
                  <MarkdownIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            )}
            {showDiffIcon && (
              <Tooltip title="View Differences">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Difference"
                  onClick={() => {
                    setIsDiff(!isDiff);
                  }}
                  size="large"
                >
                  <VSCodeDiffIcon />
                </IconButton>
              </Tooltip>
            )}
            {showEditIcon && (
              <Tooltip title="Edit">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="Edit"
                  onClick={() => {
                    console.log(data);
                    setOldData((" " + data).slice(1));
                    setEdited(true);
                    setReadOnly(false);
                    console.log(readOnly);
                  }}
                  size="large"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {showSaveIcon && (
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
            {showNewIcon && (
              <Tooltip title="New Paste">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="New Paste"
                  onClick={() => {
                    window.location.href = base_url;
                  }}
                  size="large"
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
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

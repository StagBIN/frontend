// React
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState, createContext } from "react";
import MediaQuery from "react-responsive";

// For Alerts
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// For Theme
import { ThemeProvider } from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import { GlobalStyles } from "./components/GlobalStyles";
import { darkTheme } from "./components/Themes";

import axios from "axios";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

// For Analytics
import ReactGA from "react-ga";
import React from "react";

// Local Imports
import MEditor from "./components/MonacoEditor";
import PEditor from "./components/AceEditor";
import MobileTopAppBar from "./components/MobileTopAppBar";
import TopAppBar from "./components/TopAppBar";
import BottomAppBar from "./components/BottomAppBar";
import { API_URL } from "./Constants";

export const StagBinContext = createContext();

function CustomAlert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const get_and_set_systemid = async () => {
  let system_id = localStorage.getItem("stagbin_system_id");
  const valid_system_id = uuidValidate(system_id);
  // console.log("Validated systemid: ", uuidValidate(system_id));
  if (!system_id || !valid_system_id) {
    system_id = uuidv4();
    localStorage.setItem("stagbin_system_id", system_id);
  }
  return system_id;
};

function App() {
  let theme = "dark";
  const base_url = window.location.origin;
  let pageDown = false;

  if (base_url === "http://stagbin.tk" || base_url === "https://stagbin.tk") {
    const TRACKING_ID = "UA-195260575-1"; // YOUR_OWN_TRACKING_ID
    ReactGA.initialize(TRACKING_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
  } else if (base_url === "http://test.stagbin.tk") {
    pageDown = false;
  }

  const patch_save = async (
    data,
    id,
    buid,
    base_url,
    setSuccess,
    setSizeWarning,
    setDataEmptyError
  ) => {
    const headers = { buid };

    function byteCount(s) {
      return encodeURI(s).split(/%..|./).length - 1;
    }
    const size = byteCount(data) / (1024 * 1024);
    if (size > 0.4) {
      setSizeWarning(true);
      return;
    }
    if (data.length < 1) {
      setDataEmptyError(true);
      return;
    }

    const res = await axios.patch(
      API_URL + id,
      {
        data,
      },
      { headers }
    );
    if (res.status === 200) {
      if (navigator.userAgent.indexOf("Safari") === -1)
        navigator.clipboard.writeText(base_url + "/" + res.data.id);
      setSuccess(true);
      // console.log(base_url);
      // window.location.href = base_url + "/" + res.data.id;
      setReadOnly(true);
      // Set the url
      // window.history.pushState({}, "Stagbin", base_url + "/" + res.data.id);
      // setUrl(base_url + "/" + res.data.id);
    } else {
      console.log(res.status);
      console.log(res.data);
    }

    console.log("Edited:\n", data);
  };

  const post_save = async (
    data,
    id,
    buid,
    base_url,
    setSuccess,
    setSizeWarning,
    setDataEmptyError
  ) => {
    function byteCount(s) {
      return encodeURI(s).split(/%..|./).length - 1;
    }
    const size = byteCount(data) / (1024 * 1024);
    if (size > 0.4) {
      setSizeWarning(true);
      return;
    }
    if (data.length < 1) {
      setDataEmptyError(true);
      return;
    }

    const res = await axios.post(API_URL, {
      data,
      buid,
      id,
    });

    if (res.status === 200) {
      // Check if safari
      if (navigator.userAgent.indexOf("Safari") === -1)
        navigator.clipboard.writeText(base_url + "/" + res.data.id);
      setSuccess(true);
      // console.log(base_url);
      // window.location.href = base_url + "/" + res.data.id;
      setReadOnly(true);
      setIsSameContentbuid(true);
      // Set the url
      window.history.pushState({}, "Stagbin", base_url + "/" + res.data.id);
      setUrl(res.data.id);
    } else {
      console.log(res.status);
      console.log(res.data);
    }
  };

  // const [theme, setTheme] = useState(localTheme ? localTheme : "dark");
  const [readOnly, setReadOnly] = useState(false);
  const [language, setLanguage] = useState();
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const [oldData, setOldData] = useState("");
  const [success, setSuccess] = useState(false);
  const [size_warning, setSizeWarning] = useState(false);
  const [data_empty_error, setDataEmptyError] = useState(false);
  const [isMarkdownView, updateIsMarkdownView] = useState(false);
  const [isSameContentbuid, setIsSameContentbuid] = useState("");
  const [edited, setEdited] = useState(false);
  const [isDiff, setIsDiff] = useState(false);
  // const themeToggler = () => {
  //   theme === "light" ? setTheme("dark") : setTheme("light");
  //   localStorage.setItem("stagbin_theme", theme === "light" ? "dark" : "light");
  // };

  const handleKeyDown = async (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if (event.ctrlKey && charCode === "s") {
      event.preventDefault();
      invokeSave();
    }

    // For Mac
    if (event.metaKey && charCode === "s") {
      event.preventDefault();
      console.log("Cmd + S pressed");
      invokeSave();
    }
  };

  const invokeSave = async () => {
    const system_id = await get_and_set_systemid();
    if (edited) {
      patch_save(
        data,
        url,
        system_id,
        base_url,
        setSuccess,
        setSizeWarning,
        setDataEmptyError
      );
    } else {
      post_save(
        data,
        url,
        system_id,
        base_url,
        setSuccess,
        setSizeWarning,
        setDataEmptyError
      );
    }
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false);
    setSizeWarning(false);
    setDataEmptyError(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <>
        <GlobalStyles />
        <StagBinContext.Provider
          value={{
            base_url,
            readOnly,
            theme,
            url,
            setUrl,
            data,
            setData,
            oldData,
            setOldData,
            invokeSave,
            isSameContentbuid,
            setIsSameContentbuid,
            edited,
            setIsDiff,
            setEdited,
            setReadOnly,
          }}
        >
          <div onKeyDown={handleKeyDown} className="App" style={{}}>
            <Router basename={process.env.PUBLIC_URL}>
              <div>
                <MediaQuery maxWidth={480}>
                  <MobileTopAppBar />
                </MediaQuery>
                <MediaQuery minWidth={480}>
                  <TopAppBar />
                </MediaQuery>
              </div>
              <Switch>
                <Route exact path={["/", "/:id"]}>
                  <MediaQuery maxWidth={480}>
                    <PEditor />
                  </MediaQuery>
                  <MediaQuery minWidth={480}>
                    <MEditor />
                  </MediaQuery>
                </Route>
              </Switch>
              <div>
                <BottomAppBar curTheme={theme} />
              </div>
            </Router>
            <Snackbar
              open={success}
              onClose={handleCloseSnackBar}
              autoHideDuration={3000}
            >
              <CustomAlert onClose={handleCloseSnackBar} severity="success">
                {edited
                  ? "Paste edited successfully"
                  : "Paste saved successfully"}
              </CustomAlert>
            </Snackbar>
            <Snackbar
              open={size_warning}
              onClose={handleCloseSnackBar}
              autoHideDuration={6000}
            >
              <CustomAlert onClose={handleCloseSnackBar} severity="warning">
                Content cannot be more than 400kb (Increased soon)
              </CustomAlert>
            </Snackbar>
            <Snackbar
              open={data_empty_error}
              onClose={handleCloseSnackBar}
              autoHideDuration={6000}
            >
              <CustomAlert onClose={handleCloseSnackBar} severity="Error">
                Content cannot be empty
              </CustomAlert>
            </Snackbar>
            <Snackbar
              open={pageDown}
              onClose={handleCloseSnackBar}
              autoHideDuration={1000000}
            >
              <CustomAlert onClose={handleCloseSnackBar} severity="Error">
                Internal Server Error, We are working on it
              </CustomAlert>
            </Snackbar>
          </div>
        </StagBinContext.Provider>
      </>
    </ThemeProvider>
  );
}

export default App;

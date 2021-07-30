import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";
// import MyEditor from "./components/MyEditor";
// import TopBar from "./components/Topbar";
// import BottomBar from "./components/BottomBar";
import MEditor from "./components/MonacoEditor";
import MobileTopAppBar from "./components/MobileTopAppBar";
import TopAppBar from "./components/TopAppBar";
import BottomAppBar from "./components/BottomAppBar";

// For Alerts
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// For Theme
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes";

import MediaQuery from "react-responsive";
import axios from "axios";

import { v4 as uuidv4, validate as uuidValidate } from "uuid";

function CustomAlert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const get_and_set_systemid = async () => {
  let system_id = localStorage.getItem("stagbin_system_id");
  const valid_system_id = uuidValidate(system_id);
  if (!system_id || !valid_system_id) {
    system_id = uuidv4();
    localStorage.setItem("stagbin_system_id", system_id);
  }
  return system_id;
};

const post_save = async (
  data,
  id,
  buid,
  base_url,
  setSuccess,
  setSizeWarning
) => {
  function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
  }
  const size = byteCount(data) / (1024 * 1024);
  if (size > 5) {
    setSizeWarning(true);
    return;
  }
  const res = await axios.post("https://api.stagbin.tk/dev/content", {
    data,
    buid,
    id,
  });
  if (res.status === 200) {
    navigator.clipboard.writeText(base_url + "/" + res.data.id);
    setSuccess(true);
    console.log(base_url);
    window.location.href = base_url + "/" + res.data.id;
  } else {
    console.log(res.status);
    console.log(res.data);
  }
};

function App() {
  let localTheme = localStorage.getItem("stagbin_theme");
  // const history = useHistory();

  // console.log(history);

  const [theme, setTheme] = useState(localTheme ? localTheme : "light");
  const [readOnly, setReadOnly] = useState(false);
  const [language, setLanguage] = useState("python");
  const [url, setUrl] = useState("");
  const [data, setData] = useState(
    "//Enter text and press ctrl + s to save, this also acts as a url shortner if you paste a http(s) url instead"
  );
  const [base_url, setBaseUrl] = useState(window.location.origin);
  const [success, setSuccess] = useState(false);
  const [size_warning, setSizeWarning] = useState(false);

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
    localStorage.setItem("stagbin_theme", theme === "light" ? "dark" : "light");
  };

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
    post_save(data, url, system_id, base_url, setSuccess, setSizeWarning);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false);
    setSizeWarning(false);
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <div onKeyDown={handleKeyDown} className="App" style={{}}>
          <Router basename={process.env.PUBLIC_URL}>
            <div>
              <MediaQuery maxWidth={480}>
                <MobileTopAppBar
                  toggle={themeToggler}
                  readOnlyToggle={setReadOnly}
                  readOnly={readOnly}
                  curTheme={theme}
                  isEditing={true}
                  url={url}
                  setUrl={setUrl}
                  invokeSave={invokeSave}
                />
              </MediaQuery>
              <MediaQuery minWidth={480}>
                <TopAppBar
                  toggle={themeToggler}
                  readOnly={readOnly}
                  readOnlyToggle={setReadOnly}
                  curTheme={theme}
                  isEditing={true}
                  url={url}
                  setUrl={setUrl}
                  invokeSave={invokeSave}
                  setLanguage={setLanguage}
                />
              </MediaQuery>
            </div>
            <Switch>
              <Route exact path="/">
                <MEditor
                  curTheme={theme}
                  readOnly={readOnly}
                  setReadOnly={setReadOnly}
                  url={url}
                  setUrl={setUrl}
                  data={data}
                  setData={setData}
                  invokeSave={invokeSave}
                  language={language}
                  base_url={base_url}
                />
              </Route>
              <Route path="/:id">
                <MEditor
                  curTheme={theme}
                  readOnly={readOnly}
                  setReadOnly={setReadOnly}
                  url={url}
                  setUrl={setUrl}
                  data={data}
                  setData={setData}
                  language={language}
                  base_url={base_url}
                />
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
              Paste saved successfully
            </CustomAlert>
          </Snackbar>
          <Snackbar
            open={size_warning}
            onClose={handleCloseSnackBar}
            autoHideDuration={6000}
          >
            <CustomAlert onClose={handleCloseSnackBar} severity="warning">
              Content cannot be more than 5mb
            </CustomAlert>
          </Snackbar>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;

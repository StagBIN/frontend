import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";
// import MyEditor from "./components/MyEditor";
// import TopBar from "./components/Topbar";
// import BottomBar from "./components/BottomBar";
import MEditor from "./components/MonacoEditor";
import MobileTopAppBar from "./components/MobileTopAppBar";
import TopAppBar from "./components/TopAppBar";
import BottomAppBar from "./components/BottomAppBar";

// For Theme
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes";

import MediaQuery from "react-responsive";
import axios from "axios";

import { v4 as uuidv4, validate as uuidValidate } from "uuid";

const get_and_set_systemid = async () => {
  let system_id = localStorage.getItem("stagbin_system_id");
  const valid_system_id = uuidValidate(system_id);
  if (!system_id || !valid_system_id) {
    system_id = uuidv4();
    localStorage.setItem("stagbin_system_id", system_id);
  }
  return system_id;
};

const post_save = async (data, id, buid) => {
  function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
  }
  const size = byteCount(data) / (1024 * 1024);
  if (size > 5) {
    alert("Cannot save data larger than 5mb");
    return;
  }
  const res = await axios.post(
    "https://sv32s9ipr6.execute-api.ap-south-1.amazonaws.com/dev/content",
    {
      data,
      buid,
      id,
    }
  );
  if (res.status === 200) {
    navigator.clipboard.writeText("https://stagbin.tk/" + res.data.id);
    alert("Url copied to clipboard");
    window.location.href = "https://stagbin.tk/" + id;
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
    post_save(data, url, system_id);
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
                />
              </Route>
            </Switch>
            <div>
              <BottomAppBar curTheme={theme} />
            </div>
          </Router>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;

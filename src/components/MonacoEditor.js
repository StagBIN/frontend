import { useState, useContext } from "react";

import Editor, { DiffEditor } from "@monaco-editor/react";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import axios from "axios";

// Loading
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

import { API_URL } from "../Constants";
import { StagBinContext } from "../App";

let reqData = {};

const getData = async (
  setData,
  setEncrypted,
  setEncryptedReadOnly,
  setOpenPasswordDialog,
  id,
  redirect,
  base_url,
  setIsSameContentbuid,
  setLoading
) => {
  const headers = {
    buid: localStorage.getItem("stagbin_system_id"),
  };
  const res = await axios.get(API_URL + id, { headers }).catch((err) => {
    // alert("invalid url");
    window.location.href = base_url;
    console.log(err);
  });
  console.log(res);
  if (!res) {
    return;
  }
  if (res.status === 200) {
    reqData = res.data[0];
    console.log(reqData);
    setIsSameContentbuid(reqData.edit);
    setEncrypted(reqData.isEncrypted || false);
    setEncryptedReadOnly(reqData.isEncrypted || false);
    setOpenPasswordDialog(reqData.isEncrypted || false);
    setData(reqData.data);
    setLoading(false);
  }
  if (reqData.url && !redirect) {
    window.location = reqData.data;
  }
};

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function MEditor() {
  const {
    theme: curTheme,
    encryptedReadOnly,
    readOnly,
    language,
    setLanguage,
    setReadOnly,
    setEncrypted,
    setEncryptedReadOnly,
    setUrl,
    isDiff,
    isMarkdownView,
    updateIsMarkdownView,
    data,
    setData,
    base_url,
    setIsSameContentbuid,
    setOpenPasswordDialog,
    oldData,
    edited,
  } = useContext(StagBinContext);

  const classes = useStyles();
  let { id } = useParams();
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let redirect = params.get("redirect");

  // console.log(redirect);

  const [loading, setLoading] = useState(id ? true : false);
  function set_data_if_exists() {
    if (id) {
      if (id.indexOf(".") !== -1) {
        let ext = id.split(".").at(-1);
        id = id.split(".")[0];
        switch (ext) {
          case "md":
          case "markdown":
            updateIsMarkdownView(true);
            break;
          case "js":
          case "javascript":
            setLanguage("javascript");
            break;
          case "c":
          case "cpp":
            setLanguage("cpp");
            break;
          case "py":
          case "python":
            setLanguage("python");
            break;
          case "html":
            setLanguage("html");
            break;
          case "css":
            setLanguage("css");
            break;
          case "java":
            setLanguage("java");
            break;
          case "go":
            setLanguage("go");
            break;
          default:
            break;
        }
      } else {
        setLanguage("javascript");
      }
      if (!(!readOnly && edited)) setReadOnly(true);
      setUrl(id);
      if (!edited && !encryptedReadOnly) {
        getData(
          setData,
          setEncrypted,
          setEncryptedReadOnly,
          setOpenPasswordDialog,
          id,
          redirect,
          base_url,
          setIsSameContentbuid,
          setLoading
        );
      }
    }
  }

  set_data_if_exists();
  // if (data) {
  //   document.getElementById("m-placeholder").style.display = "none";
  // }
  // console.log(oldData);
  const diffEditor = (
    <DiffEditor
      height="90vh"
      defaultLanguage={language}
      original={oldData}
      modified={data}
      theme={curTheme === "light" ? "light" : "vs-dark"}
    />
  );

  const editor = (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "65px",
          left: "64px",
          zIndex: 2,
          fontSize: "medium",
          display: data ? "none" : "block",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        * Paste & Share content :) (P.S. We also work as a URL Shortner if you
        paste just a URL!)<br></br>
        <br></br>
        Tips & Tricks:<br></br> &gt; Use CTRL+S to Save<br></br> &gt; Use the
        URL field above for personalizing your paste<br></br> &gt; We also
        support Markdown so feel free to show your skills :P<br></br>
      </div>
      <Editor
        theme={curTheme === "light" ? "light" : "vs-dark"}
        height="88vh"
        language={language}
        value={data}
        colorDecorators="true"
        options={{
          readOnly: readOnly,
          renderLineHighlight: "none",
        }}
        onChange={(value, event) => {
          setData(value);
        }}
      />
    </div>
  );

  const mkeditor = (
    <div
      className="container"
      style={{
        overflow: "hidden",
        paddingBottom: "30px",
      }}
    >
      <MDEditor.Markdown source={data} />
    </div>
  );
  // console.log(language);
  return (
    <div>
      {isDiff ? diffEditor : isMarkdownView ? mkeditor : editor}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

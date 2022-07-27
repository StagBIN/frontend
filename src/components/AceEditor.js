import AceEditor from "react-ace";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import axios from "axios";

// import mode-<language> , this imports the style and colors for the selected language.
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";
// this is an optional import just improved the interaction.
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import { useState } from "react";

// Loading
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

import { API_URL } from "../Constants";

let reqData = {};
const getData = async (
  setData,
  id,
  base_url,
  setIsSameContentbuid,
  setLoading
) => {
  // setLoading(true);
  const headers = {
    buid: localStorage.getItem("stagbin_system_id"),
  };
  const res = await axios.get(API_URL + id, { headers }).catch((err) => {
    // alert("invalid url");
    window.location.href = base_url;
  });
  // console.log(res);
  if (res.status === 200) {
    reqData = res.data[0];
    // console.log(reqData);
    setIsSameContentbuid(reqData.edit);
    setData(reqData.data);
    setLoading(false);
  }
  if (reqData.url) {
    window.location.href = reqData.data;
  }
};

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function PEditor(props) {
  const classes = useStyles();
  const curTheme = props.curTheme;
  const readOnly = props.readOnly;
  //   const language = props.language;
  const setReadOnly = props.setReadOnly;
  const [isMarkdownView, updateIsMarkdownView] = [
    props.isMarkdownView,
    props.updateIsMarkdownView,
  ];
  const setUrl = props.setUrl;
  const [data, setData] = [props.data, props.setData];
  const base_url = props.base_url;
  const setIsSameContentbuid = props.setIsSameContentbuid;
  const edited = props.edited;

  let { id } = useParams();
  const [loading, setLoading] = useState(id ? true : false);
  function set_data_if_exists() {
    if (id) {
      if (id.indexOf(".") !== -1) {
        let ext = id.split(".").at(-1);
        id = id.split(".")[0];
        if (ext === "md" || ext === "markdown") {
          updateIsMarkdownView(true);
        }
      }
      if (!(!readOnly && edited)) setReadOnly(true);
      setUrl(id);
      if (!edited)
        getData(setData, id, base_url, setIsSameContentbuid, setLoading);
    }
  }
  set_data_if_exists();

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

  const editor = (
    <div
      style={{
        overflow: "hidden",
        // paddingBottom: "30px",
      }}
    >
      <AceEditor
        placeholder="Paste & Share content :)"
        fontSize="100"
        mode="javascript"
        value={data}
        theme={curTheme === "light" ? "github" : "twilight"}
        name="basic-code-editor"
        onChange={(currentCode) => setData(currentCode)}
        highlightActiveLine={true}
        height="85vh"
        width="100%"
        readOnly={readOnly}
        aria-label="input field"
      />
    </div>
  );
  return (
    <div>
      {isMarkdownView ? mkeditor : editor}{" "}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

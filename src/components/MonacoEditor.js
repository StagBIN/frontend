import { useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import axios from "axios";

let reqData = {};
const getData = async (setData, id, base_url) => {
  // setLoading(true);
  const res = await axios
    .get("https://api.stagbin.tk/dev/content/" + id)
    .catch((err) => {
      // alert("invalid url");
      window.location.href = base_url;
    });
  console.log(res);
  if (res.status === 200) {
    reqData = res.data[0];
    console.log(reqData);
    setData(reqData.data);
    // setLoading(false);
  }
  if (reqData.url) {
    window.location.href = reqData.data;
  }
};

export default function MEditor(props) {
  const curTheme = props.curTheme;
  const readOnly = props.readOnly;
  const language = props.language;
  const setReadOnly = props.setReadOnly;
  const setUrl = props.setUrl;
  const isDiff = false;
  const [data, setData] = [props.data, props.setData];
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const base_url = props.base_url;
  // const [loading, setLoading] = useState(false);
  const { id } = useParams();
  if (id) {
    setReadOnly(true);
    setUrl(id);
    getData(setData, id, base_url);
  }
  // if (data) {
  //   document.getElementById("m-placeholder").style.display = "none";
  // }
  const diffEditor = (
    <DiffEditor
      height="90vh"
      defaultLanguage={language}
      original=""
      modified={id}
    />
  );

  const editor = (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <text
        style={{
          position: "absolute",
          top: "65px",
          left: "64px",
          zIndex: 2,
          display: showPlaceholder ? (data ? "none" : "block") : "none",
        }}
      >
        Enter text and press ctrl + s to save, this also acts as a url shortner
        if you paste a http(s) url instead
      </text>
      <Editor
        theme={curTheme === "light" ? "light" : "vs-dark"}
        height="88vh"
        language={language}
        value={data}
        colorDecorators="true"
        options={{
          readOnly: readOnly,
        }}
        onClick={() => {
          setShowPlaceholder(false);
        }}
        onChange={(value, event) => {
          setData(value);
        }}
      />
    </div>
  );
  console.log(language);
  return isDiff ? diffEditor : editor;
}

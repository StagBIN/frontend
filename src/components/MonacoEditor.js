import Editor, { DiffEditor } from "@monaco-editor/react";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import axios from "axios";

let reqData = {};
const getData = async (setData, id, base_url, setContentBuid) => {
  // setLoading(true);
  const res = await axios
    .get("https://api.stagbin.tk/dev/content/" + id)
    .catch((err) => {
      // alert("invalid url");
      window.location.href = base_url;
    });
  // console.log(res);
  if (res.status === 200) {
    reqData = res.data[0];
    // console.log(reqData);
    setContentBuid(reqData.buid);
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
  const isDiff = props.isDiff;
  const isMarkdownView = props.isMarkdownView;
  const [data, setData] = [props.data, props.setData];
  const base_url = props.base_url;
  const setContentBuid = props.setContentBuid;
  const oldData = props.oldData;
  const edited = props.edited;
  // const [loading, setLoading] = useState(false);
  const { id } = useParams();
  function set_data_if_exists() {
    if (id) {
      // console.log(readOnly, edited);
      if (!(!readOnly && edited)) setReadOnly(true);
      setUrl(id);
      if (!edited) getData(setData, id, base_url, setContentBuid);
    }
  }
  set_data_if_exists();
  // if (data) {
  //   document.getElementById("m-placeholder").style.display = "none";
  // }
  console.log(oldData);
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
      <text
        style={{
          position: "absolute",
          top: "65px",
          left: "64px",
          zIndex: 2,
          display: data ? "none" : "block",
          pointerEvents: "none",
          opacity: 0.5,
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
  return isDiff ? diffEditor : isMarkdownView ? mkeditor : editor;
}

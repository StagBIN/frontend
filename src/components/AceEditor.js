import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import axios from "axios";

// import mode-<language> , this imports the style and colors for the selected language.
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";
// this is an optional import just improved the interaction.
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

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

export default function PEditor(props) {
  const curTheme = props.curTheme;
  const readOnly = props.readOnly;
  //   const language = props.language;
  const setReadOnly = props.setReadOnly;
  const setUrl = props.setUrl;
  const [data, setData] = [props.data, props.setData];
  const base_url = props.base_url;
  const setContentBuid = props.setContentBuid;

  // const [loading, setLoading] = useState(false);

  const { id } = useParams();
  function set_data_if_exists() {
    if (id) {
      setReadOnly(true);
      setUrl(id);
      getData(setData, id, base_url, setContentBuid);
    }
  }
  set_data_if_exists();

  const editor = (
    <div
      style={{
        overflow: "hidden",
        // paddingBottom: "30px",
      }}
    >
      <AceEditor
        placeholder="Enter text and press ctrl + s to save, this also acts as a url shortner
        if you paste a http(s) url instead"
        mode="javascript"
        value={data}
        theme={curTheme === "light" ? "github" : "twilight"}
        name="basic-code-editor"
        onChange={(currentCode) => setData(currentCode)}
        highlightActiveLine={true}
        height="85vh"
        width="100%"
        readOnly={readOnly}
      />
    </div>
  );
  return editor;
}

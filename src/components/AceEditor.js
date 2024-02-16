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
import { useState, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
// Loading
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Box, makeStyles } from "@material-ui/core";

import { API_URL, EXPLAIN_URL } from "../Constants";
import { StagBinContext } from "../App";

let reqData = {};
const getData = async (
  setData,
  id,
  base_url,
  setIsSameContentbuid,
  setEncrypted,
  setEncryptedReadOnly,
  setOpenPasswordDialog,
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
    setEncrypted(reqData.isEncrypted || false);
    setEncryptedReadOnly(reqData.isEncrypted || false);
    setOpenPasswordDialog(reqData.isEncrypted || false);
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

export default function PEditor() {
  const {
    theme: curTheme,
    readOnly,
    setReadOnly,
    isMarkdownView,
    updateIsMarkdownView,
    setUrl,
    data,
    setData,
    encryptedReadOnly,
    setEncrypted,
    setEncryptedReadOnly,
    setOpenPasswordDialog,
    base_url,
    setIsSameContentbuid,
    edited,
  } = useContext(StagBinContext);

  const classes = useStyles();

  let { id } = useParams();
  const [loading, setLoading] = useState(id ? true : false);

  // AI
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleOpen = () => {
    setOpen(true);
    axios
      .post(EXPLAIN_URL, { data: data })
      .then((res) => {
        setExplanation(res.data.body);
      })
      .catch((err) => {
        console.log(err);
        setExplanation("Failed to understand the content");
      });
  };

  const handleClose = () => {
    setOpen(false);
    setExplanation("");
  };

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
      if (!edited && !encryptedReadOnly)
        getData(
          setData,
          id,
          base_url,
          setIsSameContentbuid,
          setEncrypted,
          setEncryptedReadOnly,
          setOpenPasswordDialog,
          setLoading
        );
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
      <Button
        color="primary"
        aria-label="add"
        variant="contained"
        onClick={handleOpen}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "20px",
          opacity: "0.7",
          size: "large",
          display: data ? "block" : "none",
        }}
      >
        Explain Content
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Explanation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {!explanation && "Understanding your content..."}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              {explanation ? explanation : <CircularProgress />}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

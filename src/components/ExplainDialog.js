import { useState } from "react";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MDEditor from "@uiw/react-md-editor";
import { Box } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { EXPLAIN_URL } from "../Constants";
export default function ExplainDialog({ data, exCss = {} }) {
  // AI
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleOpen = () => {
    setOpen(true);
    axios
      .post(EXPLAIN_URL, { data: data })
      .then((res) => {
        console.log("res", res.data.body);
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

  return (
    <div>
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
        <DialogTitle
          style={{
            backgroundColor: "#1a1a1a",
            color: "white",
            borderBottom: "1px solid white",
          }}
        >
          Explanation
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#0d1117" }}>
          <DialogContentText style={{ color: "white" }}>
            {!explanation && "Understanding your content..."}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              overflow="auto"
              p={2}
              style={{ backgroundColor: "#0d1117" }}
            >
              {explanation ? (
                <MDEditor.Markdown source={explanation} />
              ) : (
                <CircularProgress />
              )}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ backgroundColor: "#1a1a1a", borderTop: "1px solid white" }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            style={exCss ? exCss : { color: "white" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog(props) {
  const [open] = [props.open];
  const [password, setPassword] = [props.password, props.setPassword];
  const edited = props.edited;
  const handleClose = props.handleClose;
  const encrypted = props.encrypted;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {encrypted ? "Decrypt " : "Encrypt "} String
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {edited
              ? "Please enter password to update it, you can no longer edit the content without saving and reloading the page"
              : encrypted
              ? "Please enter the password to decrypt the content"
              : "Please enter a password to encrypt your data. Note: This password will be needed to view this data"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="Password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(password);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            {encrypted ? "Decrypt" : "Encrypt"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

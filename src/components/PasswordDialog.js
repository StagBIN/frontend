import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FormDialog(props) {
  const [open] = [props.open];
  const [password, setPassword] = [props.password, props.setPassword];
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
            {encrypted
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

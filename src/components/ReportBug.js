import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Modal, Button, Form } from "react-bootstrap";

const useStyles = makeStyles(() => ({
  modal: {
    color: "black",
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 50,
  },
}));

function ReportBug() {
  const initialFormData = {
    title: "",
    description: "",
  };
  const [modalShow, setModalShow] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);

  const handleClose = () => {
    setModalShow(false);
    setFormData(initialFormData);
  };

  const handleChange = (e, key) => {
    e.preventDefault();
    var toChange = formData;
    toChange[key] = e.target.value;
    setFormData(toChange);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FormData", formData);
  };
  const classes = useStyles();
  return (
    <div>
      <Modal
        show={modalShow}
        centered
        onHide={handleClose}
        onSubmit={handleSubmit}
      >
        <Modal.Body className={classes.modal}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Title"
                onChange={(e) => handleChange(e, "title")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                onChange={(e) => handleChange(e, "description")}
              />
            </Form.Group>
            <Button
              variant="dark"
              size="sm"
              type="submit"
              style={{ float: "right" }}
            >
              Submit Bug
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div onClick={() => setModalShow(true)}>Report A Bug</div>
    </div>
  );
}

export default ReportBug;

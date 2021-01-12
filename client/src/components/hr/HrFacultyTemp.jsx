import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const HrFacultyTemp = (props) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(null);

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  return (
    <div className="col-xl-10 offset-3">
      <Accordion style={{ marginTop: 10 }} defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <span style={{ fontWeight: "bold" }}>{props.name}</span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Button
                onClick={() => {
                  props.handleDelete(props.name);
                }}
                className="col col-6"
                variant="light"
              >
                Delete faculty
              </Button>
              <Button
                onClick={() => handleShow1()}
                className="col col-6"
                variant="light"
              >
                update faculty
              </Button>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>New Name</Form.Label>
                <Form.Control
                  placeholder="Enter name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose1()}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => props.handleUpdate(props.name, name)}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default HrFacultyTemp;

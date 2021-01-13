import React, { useState } from "react";
import "../../views/btn.css";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const HrLocationTemp = (props) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(null);
  const [type, setType] = useState("office");
  const [maxCapacity, setMaxCapacity] = useState(20);

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  return (
    <div className="col-xl-10 offset-3">
      <Accordion style={{ marginTop: 10 }} defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <span style={{ fontWeight: "bold" }}>
              {props.name}: {props.type}
            </span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <dl class="row">
                <dt class="col-sm-3">Max capacity</dt>
                <dd class="col-sm-9">{props.maxCapacity}</dd>
              </dl>
              <Alert
                variant="danger"
                show={props.showAlert}
                onClose={() => props.setShowAlert(false)}
                dismissible
              >
                {props.message}
              </Alert>
              {/* <Button
                onClick={() => {
                  props.handleDelete(props.name);
                }}
                className="col col-6"
                variant="light"
              >
                {props.spinner ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : null}
                Delete location
              </Button>
              <Button
                onClick={() => handleShow1()}
                className="col col-6"
                variant="light"
              >
                Update location
              </Button> */}
              <div class="multi-button col-12">
                <button
                  onClick={() => {
                    props.handleDelete(props.name);
                  }}
                >
                  {props.spinner ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : null}
                  Delete{" "}
                </button>
                <button onClick={() => handleShow1()}>Update</button>
              </div>
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
          <Modal.Title>Update Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>New Name</Form.Label>
                <Form.Control
                  placeholder="Enter location name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Max Capacity</Form.Label>
                <Form.Control
                  placeholder="max capacity"
                  onChange={(event) => {
                    setMaxCapacity(event.target.value);
                  }}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>type</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                  defaultValue="office"
                >
                  <option value="office">office</option>
                  <option value="tutorial room">tutorial room</option>
                  <option value="lab">lab</option>
                  <option value="lecture hall">lecture hall</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              props.handleUpdate(props.name, name, maxCapacity, type)
            }
          >
            {props.spinner1 ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default HrLocationTemp;

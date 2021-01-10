import NavBar from "./components/NavBar";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { GetUser } from "./components/GlobalState";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { coordinatorFetcher } from "./API/coordinatorFetcher";

const CoordinatorHome = () => {
  const { user } = GetUser();
  const [redirect, setRedirect] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [alertColor, setAlertColor] = useState("danger");
  const [day, setDay] = useState(6);
  const [slot, setSlot] = useState(1);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("tutorial");
  const [newDay, setNewDay] = useState(6);
  const [newSlot, setNewSlot] = useState(1);
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType] = useState("tutorial");

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);
  const handleClose2 = () => setShowDelete(false);
  const handleShow2 = () => setShowDelete(true);
  const handleClose3 = () => setShowUpdate(false);
  const handleShow3 = () => setShowUpdate(true);

  const addSlot = async () => {
    setSpinner(true);
    const res = await coordinatorFetcher.addSlot(
      location,
      day,
      slot,
      type,
      user.token
    );
    if (res === "Slot is added successfully") {
      setAlertColor("success");
      setMessage(res);
      setShowAlert(true);
      setSpinner(false);
    } else {
      setAlertColor("danger");
      setMessage(res);
      setShowAlert(true);
      setSpinner(false);
      return;
    }
  };
  const deleteSlot = async () => {
    setSpinner(true);
    const res = await coordinatorFetcher.deleteSlot(
      location,
      parseInt(day),
      parseInt(slot),
      type,
      user.token
    );
    if (res === "Slot deleted successfully") {
      setAlertColor("success");
      setMessage(res);
      setShowAlert(true);
      setSpinner(false);
    } else {
      setAlertColor("danger");
      setMessage(res);
      setShowAlert(true);
      setSpinner(false);
      return;
    }
  };
  const updateSlot = async () => {
    setSpinner(true);
    const res = await coordinatorFetcher.updateSlot(
      location,
      parseInt(day),
      parseInt(slot),
      type,
      newLocation,
      parseInt(newDay),
      parseInt(newSlot),
      newType,
      user.token
    );
    if (res === "Slot updated successfully") {
      setAlertColor("success");
      setMessage(res);
      setShowAlert(true);
      setSpinner(false);
    } else {
      setAlertColor("danger");
      setMessage(res);
      setShowAlert(true);
      setSpinner(false);
      return;
    }
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div>
      <NavBar />
      <div class="col col-12 head containerIntro">
        <h1>Home</h1>
        <span className="m-2">Welcome as an instructor</span>
      </div>
      <div class="row center offset-1">
        <div style={{ marginLeft: 200 }} class="col-md-5 containerIntro">
          <button
            onClick={() => handleShow1()}
            type="button"
            href="#"
            class="btn"
          >
            <span class="fa fa-plus fa-3x"> </span>
          </button>
          <p>add slots</p>
          <br />
          <span class="icons">click here</span>
        </div>

        <div class="col-md-5 containerIntro">
          <button
            onClick={() => handleShow2()}
            type="button"
            href="#"
            class="btn"
          >
            <span class="fa fa-trash fa-3x"> </span>
          </button>
          <p>delete slots</p>
          <br />
          <span class="icons">click here</span>
        </div>
        <div
          style={{ marginLeft: 200, marginTop: 50 }}
          class="col-md-5 containerIntro"
        >
          <button
            onClick={() => handleShow3()}
            type="button"
            href="#"
            class="btn"
          >
            <span class="fa fa-wrench fa-3x"> </span>
          </button>
          <p>update slots</p>
          <br />
          <span class="icons">update already existing</span>
        </div>

        <div style={{ marginTop: 50 }} class="col-md-5 containerIntro">
          <button
            onClick={() => setRedirect("/coordinator/request")}
            type="button"
            href="#"
            class="btn"
          >
            <span class="fa fa-envelope fa-3x"> </span>
          </button>
          <p>requests</p>
          <br />
          <span class="icons">view, accept, reject slot-linking request</span>
        </div>
      </div>

      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Location</Form.Label>
              <Form.Control
                onChange={(event) => setLocation(event.target.value)}
                placeholder="ex: c7.202"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Slot</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) => {
                  setSlot(event.target.value);
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Day</Form.Label>
              <Form.Control
                as="select"
                defaultValue="hr"
                onChange={(event) => {
                  setDay(event.target.value);
                }}
              >
                <option value="6">saturday</option>
                <option value="0">sunday</option>
                <option value="1">monday</option>
                <option value="2">tuesday</option>
                <option value="3">wednesday</option>
                <option value="4">thursday</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                defaultValue="hr"
                onChange={(event) => {
                  setType(event.target.value);
                  console.log("type" + event.target.value);
                }}
              >
                <option value="tutorial">tutorial</option>
                <option value="lecture">lecture</option>
                <option value="practical">practical</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Alert
            variant={alertColor}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAlert(false);
              setDay(6);
              handleClose1();
            }}
          >
            Close
          </Button>
          <Button onClick={addSlot} variant="success">
            {spinner ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDelete}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Location</Form.Label>
              <Form.Control
                onChange={(event) => setLocation(event.target.value)}
                placeholder="ex: c7.202"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Slot</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) => {
                  setSlot(event.target.value);
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Day</Form.Label>
              <Form.Control
                as="select"
                defaultValue="hr"
                onChange={(event) => {
                  setDay(event.target.value);
                }}
              >
                <option value="6">saturday</option>
                <option value="0">sunday</option>
                <option value="1">monday</option>
                <option value="2">tuesday</option>
                <option value="3">wednesday</option>
                <option value="4">thursday</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                defaultValue="hr"
                onChange={(event) => {
                  setType(event.target.value);
                }}
              >
                <option value="tutorial">tutorial</option>
                <option value="lecture">lecture</option>
                <option value="practical">practical</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Alert
            variant={alertColor}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAlert(false);
              setDay(6);
              handleClose2();
            }}
          >
            Close
          </Button>
          <Button onClick={deleteSlot} variant="danger">
            {spinner ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUpdate}
        onHide={handleClose3}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="ex: c7.202"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Slot</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) => {
                    setSlot(event.target.value);
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Day</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="hr"
                  onChange={(event) => {
                    setDay(event.target.value);
                  }}
                >
                  <option value="6">saturday</option>
                  <option value="0">sunday</option>
                  <option value="1">monday</option>
                  <option value="2">tuesday</option>
                  <option value="3">wednesday</option>
                  <option value="4">thursday</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="hr"
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                >
                  <option value="tutorial">tutorial</option>
                  <option value="lecture">lecture</option>
                  <option value="practical">practical</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>New location</Form.Label>
                <Form.Control
                  onChange={(event) => setNewLocation(event.target.value)}
                  placeholder="ex: c7.202"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>New slot</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) => {
                    setNewSlot(event.target.value);
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>New day</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="hr"
                  onChange={(event) => {
                    setNewDay(event.target.value);
                  }}
                >
                  <option value="6">saturday</option>
                  <option value="0">sunday</option>
                  <option value="1">monday</option>
                  <option value="2">tuesday</option>
                  <option value="3">wednesday</option>
                  <option value="4">thursday</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>New type</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="hr"
                  onChange={(event) => {
                    setNewType(event.target.value);
                  }}
                >
                  <option value="tutorial">tutorial</option>
                  <option value="lecture">lecture</option>
                  <option value="practical">practical</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
          <Alert
            variant={alertColor}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAlert(false);
              setDay(6);
              handleClose3();
            }}
          >
            Close
          </Button>
          <Button onClick={updateSlot} variant="success">
            {spinner ? (
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
export default CoordinatorHome;

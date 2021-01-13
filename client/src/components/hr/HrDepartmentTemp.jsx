import React, { useEffect, useState } from "react";
import { GetUser } from "../common/GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getterFetcher } from "../../API/getterFetcher";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../../views/btn.css";

const HrDepartmentTemp = (props) => {
  const { user } = GetUser();
  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [name, setName] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  const [hod, setHod] = useState("");
  const [newHod, setNewHod] = useState("");
  const [coordinator, setCoordinator] = useState("");

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);
  const handleClose2 = () => setShowAssign(false);
  const handleShow2 = () => setShowAssign(true);

  useEffect(() => {
    const facultyNameFunc = async () => {
      const f = await getterFetcher.getFacultyNameById(
        props.faculty,
        user.token
      );
      setFacultyName(f);
    };

    const hod = async () => {
      if (props.hod) {
        const f = await getterFetcher.getStaffById(props.hod, user.token);
        setHod(f);
      } else {
        setHod(null);
      }
    };

    const coordinatorName = async () => {
      if (props.coordinator) {
        const f = await getterFetcher.getStaffById(
          props.coordinator,
          user.token
        );
        setCoordinator(f);
      } else {
        setCoordinator(null);
      }
    };
    coordinatorName();
    facultyNameFunc();
    hod();
  }, [props.faculty, props.hod, props.coordinator, user.token]);

  const disable = () => {
    if (props.hod) return true;
    return false;
  };

  return (
    <div className="col-xl-10 offset-3">
      <Accordion style={{ marginTop: 15 }} defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <span style={{ fontWeight: "bold" }}>{props.name}</span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <dl class="row">
                <dt class="col-sm-3">Faculty </dt>
                <dd class="col-sm-9">
                  {faculty ? facultyName.name : "-no faculty-"}
                </dd>

                <dt class="col-sm-3">Head of department </dt>
                <dd class="col-sm-9">
                  {hod ? hod.name : "-no Head of department yet-"}
                </dd>

                <dt class="col-sm-3">Coordinator </dt>
                <dd class="col-sm-9">
                  {coordinator
                    ? coordinator.name
                    : "-no coordinator of department yet-"}
                </dd>
              </dl>
              <div class="multi-button col-12">
                <button
                  onClick={() => {
                    props.handleDelete(props.name);
                  }}
                >
                  {props.spinner2 ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : null}
                  Delete department
                </button>
                <button onClick={() => handleShow1()}>update department</button>
                <button onClick={() => handleShow2()} disabled={disable()}>
                  Assign head of department
                </button>
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
          <Modal.Title>update Department</Modal.Title>
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

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>New Faculty</Form.Label>
                <Form.Control
                  placeholder="enter department name"
                  onChange={(event) => {
                    setFaculty(event.target.value);
                  }}
                />
              </Form.Group>
            </Form.Row>
          </Form>
          <Alert
            variant="danger"
            show={props.showAlert}
            onClose={() => props.setShowAlert(false)}
            dismissible
          >
            {props.message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose1();
              props.setShowAlert(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="warning"
            onClick={() => props.handleUpdate(props.name, name, faculty)}
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
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAssign}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign head of department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Head of department ID</Form.Label>
              <Form.Control
                placeholder="ex:ac-2"
                onChange={(event) => {
                  setNewHod(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
          <Alert
            variant="danger"
            show={props.showAlert}
            onClose={() => props.setShowAlert(false)}
            dismissible
          >
            {props.message}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose2();
              props.setShowAlert(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => props.handleAssignHod(newHod, props.name)}
          >
            {props.spinner3 ? (
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
    </div>
  );
};
export default HrDepartmentTemp;

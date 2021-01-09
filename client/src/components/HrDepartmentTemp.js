import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getterFetcher } from "../API/getterFetcher";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const HrDepartmentTemp = (props) => {
  const { user } = GetUser();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  const [hod, setHod] = useState("");
  const [coordinator, setCoordinator] = useState("");

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

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

    const coordinatoraName = async () => {
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
    coordinatoraName();
    facultyNameFunc();
    hod();
  }, [props.faculty, props.hod]);

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
                  {props.faculty ? facultyName.name : "-no faculty-"}
                </dd>

                <dt class="col-sm-3">Head of department </dt>
                <dd class="col-sm-9">
                  {props.hod ? hod.name : "-no Head of department yet-"}
                </dd>

                <dt class="col-sm-3">Coordinator </dt>
                <dd class="col-sm-9">
                  {props.coordinator
                    ? coordinator.name
                    : "-no coordinator of department yet-"}
                </dd>
              </dl>

              <Button
                onClick={() => {
                  props.handleDelete(props.name);
                }}
                className="col col-6"
                variant="light"
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
              </Button>
              <Button
                onClick={() => handleShow1()}
                className="col col-6"
                variant="light"
              >
                update department
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
            variant="primary"
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
    </div>
  );
};
export default HrDepartmentTemp;

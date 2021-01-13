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

const HrCourseTemp = (props) => {
  const { user } = GetUser();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(null);
  const [department, setDepartment] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  const [depName, setDepName] = useState("");

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

    const depNameFunc = async () => {
      if (props.department) {
        const f = await getterFetcher.getDepNameById(
          props.department,
          user.token
        );
        setDepName(f);
      } else {
        setDepName(null);
      }
    };
    depNameFunc();
    facultyNameFunc();
  }, [props.department, props.faculty, user.token]);

  return (
    <div className="col-xl-10 offset-3">
      <Accordion style={{ marginTop: 10 }} defaultActiveKey="1">
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

                <dt class="col-sm-3">Department </dt>
                <dd class="col-sm-9">
                  {props.department ? depName : "-no department-"}
                </dd>
              </dl>
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
                  Delete course
                </button>
                <button onClick={() => handleShow1()}>update course</button>
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
          <Modal.Title>update Course</Modal.Title>
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
                <Form.Label>New Department</Form.Label>
                <Form.Control
                  placeholder="enter department name"
                  onChange={(event) => {
                    setDepartment(event.target.value);
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
            onClick={() => props.handleUpdate(props.name, name, department)}
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
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default HrCourseTemp;

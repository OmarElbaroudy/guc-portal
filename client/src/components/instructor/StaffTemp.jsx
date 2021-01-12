import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getterFetcher } from "../../API/getterFetcher";
import { GetUser } from "../common/GlobalState";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";

const Temp = (props) => {
  const { user } = GetUser();
  const [courses, setCourses] = useState([]);
  const [office, setOffice] = useState("");
  const [slot, setSlot] = useState(1);
  const [day, setDay] = useState(6);
  const [type, setType] = useState("tutorial");
  const [courseName, setCourseName] = useState("");
  const [location, setLocation] = useState("");
  const [newAcademic, setNewAcademic] = useState("");

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);
  const handleClose2 = () => setShowDelete(false);
  const handleShow2 = () => setShowDelete(true);
  const handleClose3 = () => setShowUpdate(false);
  const handleShow3 = () => setShowUpdate(true);
  const handleClose4 = () => setShowDeleteAcademic(false);
  const handleShow4 = () => setShowDeleteAcademic(true);
  const handleClose5 = () => setShowCoordinator(false);
  const handleShow5 = () => setShowCoordinator(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDeleteAcademic, setShowDeleteAcademic] = useState(false);
  const [showCoordinator, setShowCoordinator] = useState(false);

  useEffect(() => {
    const courseName = async (arr) => {
      let coursesNames = [];
      for (var j = 0; j < props.courses.length; j++) {
        const c = await getterFetcher.getCourseNameById(
          props.courses[j].courseId,
          user.token
        );
        coursesNames.push({
          course: c,
          position: props.courses[j].position,
        });
      }
      setCourses(coursesNames);
      return coursesNames;
    };

    const officeName = async () => {
      console.log("office  " + props.office);
      const l = await getterFetcher.getLocationNameById(
        props.office,
        user.token
      );
      console.log(l);
      setOffice(l);
    };

    courseName();
    officeName();
  }, [props.courses, props.office, user.token]);

  const disCourses = (course, position) => {
    if (props.courses.length === 0) return <span>no courses </span>;
    else
      return (
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item">{course}</li>
          <li class="list-group-item">{position}</li>{" "}
        </ul>
      );
  };

  return (
    <div style={{ marginTop: 15 }} className="container row">
      <div className="col-xl-10 offset-3">
        <Accordion defaultActiveKey="1">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              <span style={{ fontWeight: "bold" }}>
                {props.name} ( {props.id} )
              </span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <dl class="row">
                  <dt class="col-sm-3">e-mail</dt>
                  <dd class="col-sm-9">{props.email}</dd>

                  <dt class="col-sm-3">salary</dt>
                  <dd class="col-sm-9">{props.salary}</dd>

                  <dt class="col-sm-3">Courses</dt>
                  <dd class="col-sm-9">
                    {courses && Array.isArray(courses)
                      ? courses.map((item) => {
                          return disCourses(item.course, item.position);
                        })
                      : []}
                  </dd>

                  <dt class="col-sm-3 text-truncate">Office location</dt>
                  <dd class="col-sm-9">{office.name}</dd>
                </dl>
                <Button
                  onClick={() => {
                    handleShow1(true);
                  }}
                  className="col col-6"
                  variant="light"
                >
                  Assign slot
                </Button>
                <Button
                  onClick={() => {
                    handleShow2(true);
                  }}
                  className="col col-6"
                  variant="light"
                >
                  Delete assigned slot
                </Button>
                <Button
                  onClick={() => {
                    handleShow3(true);
                  }}
                  className="col col-6"
                  variant="light"
                >
                  update assigned slot
                </Button>
                <Button
                  onClick={() => {
                    handleShow4(true);
                  }}
                  className="col col-6"
                  variant="light"
                >
                  delete academic from course
                </Button>
                <Button
                  onClick={() => {
                    handleShow5(true);
                  }}
                  className="col col-12"
                  variant="light"
                >
                  Set course coordinator
                </Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Slot to {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>course</Form.Label>
                <Form.Control
                  onChange={(event) => setCourseName(event.target.value)}
                  placeholder="Enter course name"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="ex: c7.202"
                />
              </Form.Group>
            </Form.Row>

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
            variant={props.alertColor}
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
              props.setShowAlert(false);
              handleClose1();
              setType("tutorial");
              setSlot(1);
              setDay(6);
            }}
          >
            Close
          </Button>
          <Button
            variant="success"
            onClick={() =>
              props.handleAssign(
                courseName,
                props.id,
                location,
                parseInt(day),
                parseInt(slot),
                type
              )
            }
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
            Assign
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
          <Modal.Title>delete Slot from {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>course</Form.Label>
                <Form.Control
                  onChange={(event) => setCourseName(event.target.value)}
                  placeholder="Enter course name"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="ex: c7.202"
                />
              </Form.Group>
            </Form.Row>

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
            variant={props.alertColor}
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
              props.setShowAlert(false);
              setType("tutorial");
              setSlot(1);
              setDay(6);
              handleClose2();
            }}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              props.handleDelete(
                courseName,
                props.id,
                location,
                parseInt(day),
                parseInt(slot),
                type
              )
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
          <Modal.Title>update Slot from {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>course</Form.Label>
                <Form.Control
                  onChange={(event) => setCourseName(event.target.value)}
                  placeholder="Enter course name"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="ex: c7.202"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>New academic Id</Form.Label>
                <Form.Control
                  onChange={(event) => setNewAcademic(event.target.value)}
                  placeholder="ex: ac-1"
                />
              </Form.Group>
            </Form.Row>

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
            variant={props.alertColor}
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
              props.setShowAlert(false);
              setType("tutorial");
              setSlot(1);
              setDay(6);
              handleClose3();
            }}
          >
            Close
          </Button>
          <Button
            variant="success"
            onClick={() =>
              props.handleUpdate(
                newAcademic,
                courseName,
                props.id,
                location,
                parseInt(day),
                parseInt(slot),
                type
              )
            }
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
            update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteAcademic}
        onHide={handleClose4}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete course from {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGridEmail">
              <Form.Label>course</Form.Label>
              <Form.Control
                onChange={(event) => setCourseName(event.target.value)}
                placeholder="Enter course name"
              />
            </Form.Group>
          </Form>
          <Alert
            variant={props.alertColor}
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
              props.setShowAlert(false);
              handleClose4();
            }}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => props.handleDeleteAcademic(courseName, props.id)}
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
            delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCoordinator}
        onHide={handleClose5}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>set {props.name} as course coordinator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGridEmail">
              <Form.Label>course</Form.Label>
              <Form.Control
                onChange={(event) => setCourseName(event.target.value)}
                placeholder="Enter course name"
              />
            </Form.Group>
          </Form>
          <Alert
            variant={props.alertColor}
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
              props.setShowAlert(false);
              handleClose5();
            }}
          >
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => props.handleCord(courseName, props.id)}
          >
            {props.spinner4 ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Temp;

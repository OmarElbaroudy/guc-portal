import NavBar from "./NavBar";
import React, { useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrCourseTemp from "./HrCourseTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const HrCourse = () => {
  const { user } = GetUser();
  const [course, setCourse] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(null);
  const [department, setDepartment] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("oops something went wrong");
  const [spinner, setSpinner] = useState(false);
  const [spinner1, setSpinner1] = useState(false);
  const [spinner2, setSpinner2] = useState(false);

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await hrFetcher.viewAllCourses(user.token);
        console.log("result " + res);
        setCourse(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

  const deleteCourse = async (name) => {
    setSpinner1(true);
    try {
      const res = await hrFetcher.deleteCourse(user.token, name);
      if (res === "this course does not exist") {
        setSpinner1(false);
        setMessage(res);
        setShowAlert(true);
        return;
      }
      setCourse(res);
      setSpinner1(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateCourse = async (name, newName, department) => {
    try {
      console.log("dep " + department);
      setSpinner2(true);
      const res = await hrFetcher.updateCourse(
        user.token,
        name,
        newName,
        department
      );
      if (res === "this course does not exist") {
        setSpinner2(false);
        setMessage(res);
        setShowAlert(true);
        return;
      }
      setCourse(res);
      setSpinner2(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addCourse = async () => {
    try {
      setSpinner(true);
      const res = await hrFetcher.addCourse(user.token, name, department);
      if (
        res === "this course already exist" ||
        res === "please enter a department" ||
        res === "please enter a correct department"
      ) {
        setSpinner(false);
        setMessage(res);
        setShowAlert(true);
        return;
      }
      setCourse(res);
      setSpinner(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div style={{ marginTop: 100 }}>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Courses
      </h1>
      <Button
        onClick={() => handleShow1()}
        className="col-4 offset-4"
        variant="dark"
        style={{ padding: 8 }}
      >
        Add Course
      </Button>{" "}
      <div class="col-9">
        {course.map((obj) => {
          return (
            <HrCourseTemp
              key={obj.id}
              name={obj.name}
              department={obj.departmentId}
              faculty={obj.facultyId}
              handleDelete={deleteCourse}
              handleUpdate={updateCourse}
              spinner={spinner1}
              spinner2={spinner2}
              setShowAlert={setShowAlert}
              showAlert={showAlert}
              message={message}
            />
          );
        })}
      </div>
      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Enter course name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Department</Form.Label>
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
              handleClose1();
              setShowAlert(false);
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => addCourse()}>
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
    </div>
  );
};

export default HrCourse;

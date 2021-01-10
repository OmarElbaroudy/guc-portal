import NavBar from "./NavBar";
import React, { useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrDepartmentTemp from "./HrDepartmentTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const HrDepartment = () => {
  const { user } = GetUser();
  const [department, setDepartment] = useState([]);
  const [name, setName] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
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
        const res = await hrFetcher.viewAllDepartments(user.token);
        console.log("result " + res);
        setDepartment(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

  const updateDepartment = async (name, newName, newFaculty) => {
    try {
      setSpinner1(true);
      const res = await hrFetcher.updateDepartment(
        user.token,
        name,
        newName,
        newFaculty
      );
      if (
        res === "this faculty does not exist" ||
        res === "this department already exists"
      ) {
        setSpinner1(false);
        setMessage(res);
        setShowAlert(true);
        return;
      }
      setDepartment(res);
      setSpinner1(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addDepartment = async () => {
    try {
      setSpinner(true);
      const res = await hrFetcher.addDepartment(user.token, name, faculty);
      if (
        res === "this department already exist" ||
        res === "no faculty with such name"
      ) {
        setSpinner(false);
        setMessage(res);
        setShowAlert(true);
        return;
      }
      console.log(res);
      setDepartment(res);
      setSpinner(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDepartment = async (name) => {
    setSpinner2(true);
    try {
      const res = await hrFetcher.deleteDepartment(user.token, name);
      setDepartment(res);
      setSpinner2(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div style={{ marginTop: 100 }}>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Departments
      </h1>
      <Button
        onClick={() => handleShow1()}
        className="col-4 offset-4"
        variant="dark"
        style={{ padding: 8 }}
      >
        Add Department
      </Button>{" "}
      <div class="col-9">
        {department.map((obj) => {
          return (
            <HrDepartmentTemp
              key={obj.id}
              name={obj.name}
              faculty={obj.facultyId}
              hod={obj.hodId}
              coordinator={obj.coordinatorId}
              handleDelete={deleteDepartment}
              handleUpdate={updateDepartment}
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
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Enter department name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Faculty</Form.Label>
                <Form.Control
                  placeholder="enter faculty name"
                  onChange={(event) => {
                    setFaculty(event.target.value);
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
          <Button variant="primary" onClick={() => addDepartment()}>
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

export default HrDepartment;

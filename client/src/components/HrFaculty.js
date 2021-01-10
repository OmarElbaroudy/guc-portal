import NavBar from "./NavBar";
import React, { useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrFacultyTemp from "./HrFacultyTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const HrFaculty = () => {
  const { user } = GetUser();
  const [faculty, setFaculty] = useState([]);
  const [name, setName] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await hrFetcher.viewAllFaculties(user.token);
        console.log("result " + res);
        setFaculty(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

  const deleteFaculty = async (name) => {
    try {
      const res = await hrFetcher.deleteFaculty(user.token, name);
      setFaculty(res);
    } catch (err) {
      console.log(err);
    }
  };
  const updateFaculty = async (name, newName) => {
    try {
      const res = await hrFetcher.updateFaculty(user.token, name, newName);
      console.log(res);
      setFaculty(res);
    } catch (err) {
      console.log(err);
    }
  };

  const addFaculty = async () => {
    try {
      const res = await hrFetcher.addFaculty(user.token, name);
      console.log(res);
      setFaculty(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div style={{ marginTop: 100 }}>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Faculties
      </h1>
      <Button
        onClick={() => handleShow1()}
        className="col-4 offset-4"
        variant="dark"
        style={{ padding: 8 }}
      >
        Add Faculty
      </Button>{" "}
      <div class="col-9">
        {faculty.map((obj) => {
          return (
            <HrFacultyTemp
              key={obj.id}
              name={obj.name}
              handleDelete={deleteFaculty}
              handleUpdate={updateFaculty}
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
                  placeholder="Enter Faculty name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={() => addFaculty()}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HrFaculty;

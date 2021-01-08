import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrLocationTemp from "./HrLocationTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const HrLocation = () => {
  const { user } = GetUser();
  const [location, setLocation] = useState([]);
  const [name, setName] = useState(null);
  const [type, setType] = useState("office");
  const [maxCapacity, setMaxCapacity] = useState(20);

  const [showAdd, setShowAdd] = useState(false);
  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await hrFetcher.viewAllLocations(user.token);
        console.log("result " + res);
        setLocation(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

  const deleteLocation = async (name) => {
    try {
      const res = await hrFetcher.deleteLocation(user.token, name);
      setLocation(res);
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocation = async (name, newName, maxCapacity, type) => {
    try {
      const res = await hrFetcher.updateLocation(
        user.token,
        name,
        newName,
        maxCapacity,
        type
      );
      console.log(res);
      setLocation(res);
    } catch (err) {
      console.log(err);
    }
  };

  const addLocation = async () => {
    try {
      const res = await hrFetcher.addLocation(
        user.token,
        name,
        maxCapacity,
        type
      );
      console.log(res);
      setLocation(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
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
        Add Location
      </Button>{" "}
      <div class="col-9">
        {location.map((obj) => {
          return (
            <HrLocationTemp
              key={obj.id}
              name={obj.name}
              maxCapacity={obj.maxCapacity}
              handleDelete={deleteLocation}
              handleUpdate={updateLocation}
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
                <Form.Control placeholder="Enter location name" onChange={(event) => {
                    setName(event.target.value);
                  }} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Max Capacity</Form.Label>
                <Form.Control placeholder="max capacity" onChange={(event) => {
                    setMaxCapacity(event.target.value);
                  }}/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>tyoe</Form.Label>
                <Form.Control as="select" onChange={(event) => {setType(event.target.value);}} defaultValue="office">
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
          <Button variant="secondary" onClick={() => handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={() => addLocation()}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HrLocation;

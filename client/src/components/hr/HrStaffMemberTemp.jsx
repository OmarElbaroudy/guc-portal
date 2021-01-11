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

const HrStaffMemberTemp = (props) => {
  const { user } = GetUser();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [salary, setSalary] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);
  const [office, setOffice] = useState("");

  useEffect(() => {
    const x = async () => {
      const y = await getterFetcher.getLocationNameById(
        props.office,
        user.token
      );
      //console.log(y)
      setOffice(y);
    };
    x();
  }, [props.office, user.token]);

  return (
    <div className="col-xl-10 offset-3" style={{ marginTop: 10 }}>
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

                <dt class="col-sm-3 text-truncate">Office location</dt>
                <dd class="col-sm-9">
                  {office.name ? office.name : "-no office yet-"}
                </dd>
              </dl>
              <Button
                onClick={() => {
                  props.handleDelete(props.id);
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
                Delete User
              </Button>
              <Button
                onClick={() => handleShow1()}
                className="col col-6"
                variant="light"
              >
                update user
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
          <Modal.Title>update Staff Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Enter name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Office Location</Form.Label>
                <Form.Control
                  placeholder="ex: c7.202"
                  onChange={(event) => {
                    setOfficeLocation(event.target.value);
                  }}
                />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="ex: test@guc.edu.eg"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>salary</Form.Label>
              <Form.Control
                placeholder="10000"
                onChange={(event) => {
                  setSalary(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Alert
          variant="danger"
          show={props.showAlert}
          onClose={() => props.setShowAlert(false)}
          dismissible
        >
          {props.message}
        </Alert>
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
            onClick={() =>
              props.handleUpdate(props.id, name, officeLocation, email, salary)
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
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default HrStaffMemberTemp;

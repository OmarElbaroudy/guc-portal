import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const ViewStaff = (props) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  const handleClose2 = () => setShowDelete(false);
  const handleShow2 = () => setShowDelete(true);

  return (
    <div>
      <div style={{ marginTop: 15 }} className="container row">
        <div className="col-xl-10 offset-3">
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <span>props.name</span>
                <span style={{ paddingInline: 300 }}>props.Id</span>
                <span style={{ paddingInline: 0 }}>props.type</span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <dl class="row">
                    <dt class="col-sm-3">e-mail</dt>
                    <dd class="col-sm-9">props.email</dd>

                    <dt class="col-sm-3">salary</dt>
                    <dd class="col-sm-9">props salary will be sent here</dd>

                    <dt class="col-sm-3">Courses</dt>
                    <dd class="col-sm-9">
                      {/* {props.courses.map((course) => {
                      <ul class="list-group list-group-horizontal">
                        <li class="list-group-item">Cras justo odio</li>
                        <li class="list-group-item">Dapibus ac facilisis in</li>
                      </ul>;
                    })} */}
                      props courses array will be mapped here
                    </dd>

                    <dt class="col-sm-3 text-truncate">dayOff</dt>
                    <dd class="col-sm-9">props.dayOff</dd>
                  </dl>
                  <Button variant="light" onClick={handleShow1}>
                    Add course
                  </Button>
                  <Button
                    style={{ marginLeft: 50 }}
                    variant="light"
                    onClick={handleShow2}
                  >
                    Delete course
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </div>
      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton variant="outline-secondary" title="choose course">
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Item>Another action</Dropdown.Item>
            <Dropdown.Item>Something else</Dropdown.Item>
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button variant="primary">Add</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDelete}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton variant="outline-secondary" title="choose course">
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Item>Another action</Dropdown.Item>
            <Dropdown.Item>Something else</Dropdown.Item>
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary">Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewStaff;

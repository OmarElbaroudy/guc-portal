import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getterFetcher } from "../API/getterFetcher";
import { GetUser } from "./GlobalState";

const ViewStaff = (props) => {
  const { user } = GetUser();
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [course, setCourse] = useState("");
  const [type, setType] = useState("");
  const [courses, setCourses] = useState([]);

  console.log(props.courses);

  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);

  const handleClose2 = () => setShowDelete(false);
  const handleShow2 = () => setShowDelete(true);

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
    courseName();
  });

  const getDay = (num) => {
    switch (num) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  };

  return (
    <div>
      <div style={{ marginTop: 15 }} className="container row">
        <div className="col-xl-10 offset-3">
          <Accordion defaultActiveKey="1">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <span>{props.name}</span>
                <span style={{ paddingInline: 300 }}>{props.id}</span>
                <span style={{ paddingInline: 0 }}>props.type</span>
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

                    <dt class="col-sm-3 text-truncate">dayOff</dt>
                    <dd class="col-sm-9">{getDay(props.dayOff)}</dd>
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
          <Form.Control
            onClick={(event) => {
              setCourse(event.target.value);
            }}
            type="course"
            placeholder="Enter course"
          />
          <Form.Text className="text-muted">
            Enter the exact course name.
          </Form.Text>
          <Form.Control
            onClick={(event) => {
              setType(event.target.value);
            }}
            type="type"
            placeholder="Enter type"
          />
          <Form.Text className="text-muted">
            enter "instructor" or "academic"
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button
            onClick={() => props.handleAdd(course, props.id, type)}
            variant="primary"
          >
            Add
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
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            onClick={(event) => {
              setCourse(event.target.value);
            }}
            type="course"
            placeholder="Enter course"
          />
          <Form.Text className="text-muted">
            Enter the exact course name.
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button
            onClick={() => {
              props.handleDelete(course, props.id);
              setCourse("");
            }}
            variant="primary"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewStaff;

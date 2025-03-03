import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getterFetcher } from "../../API/getterFetcher";
import { GetUser } from "../common/GlobalState";
import "../../views/btn.css";

const ReqTemp = (props) => {
  const { user } = GetUser();
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [comment, setComment] = useState("");
  const [staff, setStaff] = useState("");
  const [course, setCourse] = useState("");
  const [location, setLocation] = useState("");
  const handleClose1 = () => setShowAccept(false);
  const handleShow1 = () => setShowAccept(true);
  const handleClose2 = () => setShowReject(false);
  const handleShow2 = () => setShowReject(true);

  useEffect(() => {
    const staff = async () => {
      const a = await getterFetcher.getStaffById(props.senderId, user.token);
      setStaff(a);
    };
    const courseAndLocation = async () => {
      if (props.type === "replacement") {
        const c = await getterFetcher.getCourseNameById(
          props.replacement.courseId,
          user.token
        );
        const l = await getterFetcher.getLocationNameById(
          props.replacement.locationId,
          user.token
        );
        setCourse(c);
        setLocation(l.name);
      }
      if (props.type === "slotLinking") {
        const c = await getterFetcher.getCourseNameById(
          props.slotLinking.courseId,
          user.token
        );
        const l = await getterFetcher.getLocationNameById(
          props.slotLinking.locationId,
          user.token
        );
        console.log(c);
        console.log(l);
        setCourse(c);
        setLocation(l);
      }
    };
    staff();
    courseAndLocation();
  }, [props, user.token]);
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
      default:
    }
  };
  const disable = () => {
    if (props.status !== "pending") return true;
    return false;
  };
  const renderReplacment = () => {
    console.log(props.replacement);
    if (props.type === "slotLinking")
      return (
        <ul class="list-group">
          <li class="list-group-item">{course}</li>
          <li class="list-group-item">{getDay(props.slotLinking.weekDay)}</li>
          <li class="list-group-item">{props.slotLinking.slot}</li>
          <li class="list-group-item">{location.name}</li>
        </ul>
      );
    return;
  };

  return (
    <div>
      <div style={{ marginTop: 15 }} className="container row">
        <div className="col-xl-10 offset-3">
          <Accordion defaultActiveKey="1">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <span style={{ fontWeight: "bold" }}>
                  {staff.name} : {props.type}-{props.status}
                </span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <dl class="row">
                    <dt class="col-sm-3">Issue date</dt>
                    <dd class="col-sm-9">{props.issueDate}</dd>

                    {(props.type === "replacement" ||
                      props.type === "slotLinking") && (
                      <React.Fragment>
                        <dt class="col-sm-3">{props.type}</dt>
                        <dd class="col-sm-9">{renderReplacment()}</dd>
                      </React.Fragment>
                    )}

                    <dt class="col-sm-3">sender comment</dt>
                    <dd class="col-sm-9">
                      {props.senderComment
                        ? props.senderComment
                        : "-No comment-"}
                    </dd>
                  </dl>
                  <div class="multi-button col-12">
                    <button onClick={handleShow1} disabled={disable()}>
                      Accept request
                    </button>
                    <button onClick={handleShow2} disabled={disable()}>
                      Reject request
                    </button>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </div>
      <Modal
        show={showAccept}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Accept Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            onChange={(event) => {
              setComment(event.target.value);
            }}
            as="textarea"
            rows="3"
            type="comment"
            placeholder="Enter comment"
          />
          <Form.Text className="text-muted">
            Enter message to sender if you want
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button id="close" onClick={handleClose1}>
            Close
          </Button>
          <Button
            onClick={() => {
              setShowAccept(false);
              props.handleAccept(props._id, comment);
            }}
            variant="primary"
          >
            Accept
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showReject}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            onChange={(event) => {
              setComment(event.target.value);
            }}
            as="textarea"
            rows="3"
            type="comment"
            placeholder="Enter comment"
          />
          <Form.Text className="text-muted">
            Enter message to sender if you want
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button id="close" onClick={handleClose2}>
            Close
          </Button>
          <Button
            onClick={() => {
              setShowReject(false);
              props.handleReject(props._id, comment);
            }}
            variant="primary"
          >
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ReqTemp;

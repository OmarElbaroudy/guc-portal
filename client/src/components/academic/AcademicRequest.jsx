import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { getterFetcher } from "../../API/getterFetcher";
import { GetUser } from "../common/GlobalState";

const AcademicRequest = (props) => {
  const { user } = GetUser();
  const [staff, setStaff] = useState("");
  const [course, setCourse] = useState("");
  const [location, setLocation] = useState("");
  const [spinner, setSpinner] = useState(false);

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

  const renderReplacement = () => {
    if (props.type === "replacement") {
      return (
        <ul class="list-group">
          <li class="list-group-item">{course}</li>
          <li class="list-group-item">{props.replacement.slotDate}</li>
          <li class="list-group-item">{props.replacement.slot}</li>
          <li class="list-group-item">{location.name}</li>
          <li class="list-group-item">{props.replacement.academicResponse}</li>
        </ul>
      );
    }
    if (props.type === "slotLinking") {
      return (
        <ul class="list-group">
          <li class="list-group-item">{course}</li>
          <li class="list-group-item">{getDay(props.slotLinking.weekDay)}</li>
          <li class="list-group-item">{props.slotLinking.slot}</li>
          <li class="list-group-item">{location.name}</li>
        </ul>
      );
    }
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
                    {props.type === "sick" ||
                      props.type === "maternity" ||
                      (props.type === "accidental" && (
                        <React.Fragment>
                          <dt class="col-sm-3">Target day</dt>
                          <dd class="col-sm-9">{props.targetDay}</dd>
                        </React.Fragment>
                      ))}

                    {props.type === "changeDayOff" && (
                      <React.Fragment>
                        <dt class="col-sm-3">New day off</dt>
                        <dd class="col-sm-9">{getDay(props.newDayOff)}</dd>
                      </React.Fragment>
                    )}

                    <dt class="col-sm-3">Issue date</dt>
                    <dd class="col-sm-9">{props.issueDate}</dd>

                    {(props.type === "replacement" ||
                      props.type === "slotLinking") && (
                      <React.Fragment>
                        <dt class="col-sm-3">{props.type}</dt>
                        <dd class="col-sm-9">{renderReplacement()}</dd>
                      </React.Fragment>
                    )}

                    {props.type === "compensation" && (
                      <React.Fragment>
                        <dt class="col-sm-3">Compensated</dt>
                        <dd class="col-sm-9">
                          {props.compensated
                            ? props.compensated.type
                            : "-not sent-"}
                        </dd>
                      </React.Fragment>
                    )}
                    <dt class="col-sm-3">sender comment</dt>
                    <dd class="col-sm-9">
                      {props.senderComment
                        ? props.senderComment
                        : "-No comment-"}
                    </dd>
                  </dl>

                  <Button
                    className="col col-3"
                    variant="danger"
                    onClick={() => {
                      setSpinner(true);
                      props.handleDelete(props.status, props._id);
                    }}
                    disabled={disable()}
                  >
                    {spinner ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : null}
                    Cancel Request
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
export default AcademicRequest;

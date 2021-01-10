import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

const Record = (props) => {
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
  const getDate = () => {
    const d = new Date(props.day);
    const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDay()));
    return utc.getDate() + "/" + (utc.getMonth() + 1) + "/" + utc.getFullYear();
  };

  const getTime = () => {
    const hours = Math.floor(props.totalTime / (1000 * 60 * 60));
    const minutes = Math.floor(props.totalTime / (1000 * 60));

    return (
      <h6>
        total time spent is {hours} <strong>hours</strong> and {minutes}{" "}
        <strong>minutes</strong>
      </h6>
    );
  };

  return (
    <div style={{ marginTop: 15 }} className="container row">
      <div className="col-xl-12">
        <Accordion defaultActiveKey="1">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              <span style={{ fontWeight: "bold" }}>
                attendance record number {props.idx + 1}
              </span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <h6>
                  <strong>attendance date</strong> : {getDay(props.weekDay)}{" "}
                  {getDate()}
                </h6>
                {props.compensation && (
                  <h6>this day is considered as compensation</h6>
                )}
                {getTime()}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default Record;

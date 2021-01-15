import React, { useEffect, useState } from "react";
import { GetUser } from "../common/GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import { academicFetcher } from "../../API/academicFetcher";
import { Form } from "react-bootstrap";
import AcademicRequest from "./AcademicRequest";
import NavBar from "../misc/NavBar";

const ViewSubmittedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("all");
  const { user } = GetUser();

  useEffect(() => {
    //setInterval(() => {}, 10000);
    const data = async () => {
      try {
        const res = await academicFetcher.viewRequests(status, user.token);
        setRequests(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [status, user.token]);

  const delReq = async (status, id) => {
    const res = await academicFetcher.cancelRequest(status, id, user.token);
    setRequests(res);
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ fontWeight: "bold", padding: 50 }} class="display-6">
        Submitted Requests
      </h1>
      <Form.Label className="offset-4">
        <strong>choose request status : &nbsp; &nbsp;</strong>
      </Form.Label>
      <Form.Control
        as="select"
        className="mr-sm-2 col-2"
        id="requestType"
        custom
        onChange={(event) => {
          setStatus(event.target.value);
        }}
      >
        <option value="all">All</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
        <option value="pending">Pending</option>
      </Form.Control>
      <div>
        {requests.map((obj) => {
          return (
            <AcademicRequest
              key={obj._id}
              status={obj.status}
              type={obj.type}
              _id={obj._id}
              senderComment={obj.senderComment}
              senderId={obj.senderId}
              issueDate={obj.issueDate}
              replacement={obj.replacement}
              slotLinking={obj.slotLinking}
              targetDate={obj.targetDate}
              newDayOff={obj.newDayOff}
              compensated={obj.compensated}
              handleDelete={delReq}
            />
          );
        })}
      </div>
    </div>
  );
};
export default ViewSubmittedRequests;

import React, { useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import Request from "./coordinatorReqTemp";
import NavBar from "./NavBar";
import { coordinatorFetcher } from "../API/coordinatorFetcher";

const ViewRequest = () => {
  const [requests, setRequests] = useState([]);
  const { user } = GetUser();
  useEffect(() => {
    const data = async () => {
      try {
        const res = await coordinatorFetcher.viewReq(user.token);
        if (res === "No requests found") return;
        setRequests(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [user.token]);

  const acceptReq = async (id, comment) => {
    const res = await coordinatorFetcher.acceptReq(id, comment, user.token);
    var newRequests = [...requests];
    var foundIndex = await newRequests.findIndex((x) => x._id === res._id);
    newRequests[foundIndex] = res;
    setRequests(newRequests);
  };

  const rejectReq = async (id, comment) => {
    const res = await coordinatorFetcher.rejectReq(id, comment, user.token);
    var newRequests = [...requests];
    console.log("newRequests " + newRequests[0]);
    var foundIndex = await newRequests.findIndex((x) => x._id === res._id);
    newRequests[foundIndex] = res;
    setRequests(newRequests);
  };

  return (
    <div>
      <NavBar sticky="top" />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Requests
      </h1>
      <div>
        {requests.map((obj) => {
          return (
            <Request
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
              handleAccept={acceptReq}
              handleReject={rejectReq}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ViewRequest;

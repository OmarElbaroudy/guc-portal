import React, { useEffect, useState } from "react";
import { GetUser } from "../common/GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import { academicFetcher } from "../../API/academicFetcher";
import AcademicRequest from "./AcademicRequest";
import NavBar from "../misc/NavBar";

const ViewReplacementRequests = () => {
  const [requests, setRequests] = useState([]);
  const { user } = GetUser();

  useEffect(() => {
    //setInterval(() => {}, 10000);
    const data = async () => {
      try {
        const res = await academicFetcher.viewReplacement(user.token);
        setRequests(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [user.token]);

  const delReq = async (type, id) => {
    const res = await academicFetcher.cancelRequest(false, id, user.token);
    setRequests(res);
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ fontWeight: "bold", padding: 50 }} class="display-6">
        Replacement Requests
      </h1>
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
export default ViewReplacementRequests;

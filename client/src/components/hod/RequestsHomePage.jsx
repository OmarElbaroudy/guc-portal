import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Redirect } from "react-router-dom";
import { GetUser } from "../common/GlobalState";
import { hodFetcher } from "../../API/hodFetcher";
import { useHistory } from "react-router-dom";

const RequestOnHome = () => {
  const { user } = GetUser();
  const [redirect, setRedirect] = useState(null);
  const [pending, setPending] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const history = useHistory();

  let classes = "badge m-5 ";
  classes += pending === 0 ? "badge-secondary" : "badge-info";

  useEffect(() => {
    setInterval(() => {}, 10000);
    const data = async () => {
      let p = 0;
      let a = 0;
      let r = 0;
      try {
        const res = await hodFetcher.viewRequests(user.token);
        for (const entry of res) {
          if (entry.status === "accepted") a++;
          if (entry.status === "rejected") r++;
          if (entry.status === "pending") p++;
        }
        setPending(p);
        setAccepted(a);
        setRejected(r);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [user.token]);

  const formatCount = () => {
    return pending === 0 ? "zero" : pending;
  };

  if (redirect) {
    history.push("/hodHome");
    return <Redirect to={redirect} />;
  }
  return (
    <div style={{ backgroundColor: "#B4CDCD" }} class="card text-white ">
      <div class="card-header">
        Requests
        <span className={classes}>{formatCount()}</span>
      </div>
      <div class="card-body">
        <h5 class="card-title">Current requests records</h5>
        <ul class="col-7 offset-3">
          <li>You currently have {pending} pending requests</li>
          <li>You currently have {accepted} accepted requests</li>
          <li>You currently have {rejected} rejected requests</li>
        </ul>
        <btn
          class="btn btn-dark col-10 offset-1"
          onClick={() => {
            setRedirect("/homePage/requests");
          }}
        >
          Go requests
        </btn>
      </div>
    </div>
  );
};
export default RequestOnHome;

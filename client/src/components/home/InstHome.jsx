import NavBar from "../misc/NavBar";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const InstHome = () => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(null);
  if (redirect) {
    history.push("/instructorHome");
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <NavBar />
      <div class="row center offset-1">
        <div
          style={{ marginTop: 50, marginLeft: 200 }}
          class="col-md-5 containerIntro"
        >
          <button
            type="button"
            href="#"
            onClick={() => setRedirect("/instructor/courses")}
            class="btn"
          >
            <span class="fas fa-book fa-3x"> </span>
          </button>
          <p>Courses</p>
          <br />
          <span class="icons">view courses names,coverage, and schedules</span>
        </div>

        <div
          style={{ marginTop: 50, marginRight: 200 }}
          class="col-md-2 containerIntro"
        >
          <button
            type="button"
            onClick={() => setRedirect("/instructor/staffMembers")}
            href="#"
            class="btn"
          >
            <span class="fa fa-users fa-3x"> </span>
          </button>
          <p>Staff members</p>
          <br />
          <span class="icons">
            view staff members
            <br />
            assign, delete and update slot assignment
            <br />
            delete academic from course
            <br />
            set coordinator
          </span>
        </div>
      </div>
    </div>
  );
};
export default InstHome;

import React, { useState } from "react";
import "../../views/hodHome.css";
import "bootstrap/dist/css/bootstrap.css";
import { Redirect } from "react-router-dom";
import NavBar from "../misc/NavBar";
import RequestsHome from "../hod/RequestsHomePage";
import { useHistory } from "react-router-dom";

function HodHome() {
  const history = useHistory();
  const [redirect, setRedirect] = useState(null);

  if (redirect) {
    history.push("/hodHome");
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <NavBar />
      <div class="col col-12 head containerIntro">
        <h1>Home</h1>
        <span className="m-2">Welcome as head of department</span>
      </div>
      <div class="container">
        <div class="row center">
          <div class="col-md-4 containerIntro offset-2">
            <button
              type="button"
              href="#"
              onClick={() => {
                setRedirect("/homePage/coursesCoverage");
              }}
              class="btn"
            >
              <span class="fas fa-book fa-3x" href="#"></span>
            </button>
            <p>Courses</p>
            <br />
            <span class="icons">view course coverage and schedule</span>
          </div>

          <div
            class="col-md-4 offset-1
          containerIntro"
          >
            <button
              type="button"
              href="#"
              onClick={() => {
                setRedirect("/homePage/staffMembers");
              }}
              class="btn"
            >
              <span class="fa fa-users fa-3x"> </span>
            </button>
            <p>Staff members</p>
            <br />
            <span class="icons">
              view staff members profiles, assigning, updating, deleting course
              instructor
            </span>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row center">
          <div class="col-md-8 offset-2 containerIntro">
            <RequestsHome />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodHome;

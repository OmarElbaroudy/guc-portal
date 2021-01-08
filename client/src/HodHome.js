import React, { component, useState } from "react";
import "./hodHome.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import RequestsHome from "./components/requestsHomePage";

let x = 0;
function HodHome() {
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  let classes = "badge m-5 ";
  classes += x === 0 ? "badge-warning" : "badge-primary";
  const [redirect, setRedirect] = useState(null);

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div class="container-fluid">
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

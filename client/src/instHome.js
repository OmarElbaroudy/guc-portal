import NavBar from "./components/NavBar";
import React, { component, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";

const HrHome = () => {
  const [redirect, setRedirect] = useState(null);
  if (redirect) return <Redirect to={redirect} />;

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  return (
    <div>
      <NavBar />
      <div class="row center offset-1">
        <div class="col-md-4 containerIntro">
          <button type="button" href="#" class="btn">
            <span class="fa fa-map-marker fa-3x" href="#"></span>
          </button>
          <p>Locations</p>
          <br />
          <span class="icons">
            view, add, update,
            <br /> and delete locations
          </span>
        </div>

        <div class="col-md-4 containerIntro">
          <button type="button" href="#" class="btn">
            <span class="fas fa-school fa-3x"> </span>
          </button>
          <p>Faculties</p>
          <br />
          <span class="icons">
            {" "}
            view, add, update,
            <br /> and delete Faculties
          </span>
        </div>

        <div class="col-md-4 containerIntro">
          <button type="button" href="#" class="btn">
            <span class="fa fa-university fa-3x"> </span>
          </button>
          <p>Departments</p>
          <br />
          <span class="icons">
            view, add, update,
            <br /> delete, and assigning head to the department
          </span>
        </div>

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
          <span class="icons">
            view, add, update,
            <br /> and delete courses
          </span>
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
            view, add, update,
            <br /> and delete staff members
          </span>
        </div>
      </div>
    </div>
  );
};
export default HrHome;

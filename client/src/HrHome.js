import NavBar from "./components/NavBar";
import React, { component, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";


const HrHome = () => {
  
  const [redirect,setRedirect ]=useState(null)
  if (redirect) return <Redirect to={redirect} />;


  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  return(
    <div>
      <NavBar />
      <div class="row center offset-1">
          <div class="col-md-2 containerIntro">
            <button
              type="button"
              href="#"
              class="btn"
            >
              <span class="fas fa-book fa-3x" href="#"></span>
            </button>
            <p>Courses</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-2 containerIntro">
            <button
              type="button"
              href="#"
              class="btn"
            >
              <span class="far fa-user fa-3x"> </span>
            </button>
            <p>Profile</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-2 containerIntro">
            <button
              type="button"
              href="#"
              class="btn"
            >
              <span class="far fa-user fa-3x"> </span>
            </button>
            <p>Profile</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-2 containerIntro">
            <button type="button" href="#" onClick={openNav} class="btn">
              <span class="fa fa-industry fa-3x"> </span>
            </button>
            <p>Inventory control</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-2 containerIntro">
            <button onClick={()=>setRedirect("/hr/StaffMembers")}
              type="button"
              href="/hr/StaffMembers"
              class="btn"
            >
              <span class="fa fa-users fa-3x"> </span>
            </button>
            <p>Staff members</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>
        </div>
    </div>
   
  )
  return <NavBar />;
};
export default HrHome;

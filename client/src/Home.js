import React, { component, useState } from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import RequestsHome from "./components/requestsHomePage";

let x = 0;
function Home() {
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  const [notificationNum, setNotificationNum] = useState(x);
  let classes = "badge m-5 ";
  classes += x === 0 ? "badge-warning" : "badge-primary";
  const [redirect, setRedirect] = useState(null);

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div class="container-fluid">
      <NavBar />
      <div class="col col-12 head containerIntro">
        <h1>Home</h1>
        <span className="m-2">Welcome</span>
      </div>
      <div class="container">
        <div class="row center">
          <div class="col-md-3 containerIntro">
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
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-3 containerIntro">
            <button
              type="button"
              href="#"
              onClick={() => {
                setRedirect("/homePage/viewProfile");
              }}
              class="btn"
            >
              <span class="far fa-user fa-3x"> </span>
            </button>
            <p>Profile</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-3 containerIntro">
            <button type="button" href="#" onClick={openNav} class="btn">
              <span class="fa fa-industry fa-3x"> </span>
            </button>
            <p>Inventory control</p>
            <br />
            <span class="border-left border-dark icons">description</span>
          </div>

          <div class="col-md-3 containerIntro">
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
            <span class="border-left border-dark icons">description</span>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row center">
          <div class="col-md-4 containerIntro">
            <RequestsHome />
          </div>

          <div class="col-md-4 containerIntro">
            <div class="card text-white bg-dark ">
              <div class="card-header">Featured</div>
              <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
                <a href="#" class="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>

          <div class="col-md-4 containerIntro">
            <div class="card text-white bg-dark ">
              <div class="card-header">Featured</div>
              <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
                <a href="#" class="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

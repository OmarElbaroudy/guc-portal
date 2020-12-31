import React, { component, useState } from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.css";

let x = 0;
function Home() {
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
  };
  const [notificationNum, setNotificationNum] = useState(x);
  const handleChange = () => {
    x++;
    setNotificationNum(x);
  };

  let classes = "badge m-5 ";
  classes += x === 0 ? "badge-warning" : "badge-primary";

  return (
    <body>
      <div id="mySidenav" class="sidenav">
        <button type="button" class="btn btn-light closebtn" onClick={closeNav}>
          &times;
        </button>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </div>

      <div id="main" class="row container-fluid">
        <nav class="col-xl-12 navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              {" "}
              <button type="button" href="#" onClick={openNav} class="btn">
                <span class="navbar-toggler-icon"></span>
              </button>
              GUC
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Link
                  </a>
                </li>
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <a class="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link disabled"
                    href="#"
                    tabindex="-1"
                    aria-disabled="true"
                  >
                    Disabled
                  </a>
                </li>
              </ul>
              <form class="d-flex">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button class="btn btn-outline-dark" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>
        <div class="col col-12 head containerIntro">
          <h1>Home</h1>
          <span className="m-2">Welcome</span>
        </div>
        <div class="container">
          <div class="row center">
            <div class="col-md-3 containerIntro">
              <span class="fas fa-book fa-3x" href="#"></span>
              <p>Courses</p>
              <br />
              <span class="border-left border-dark icons">description</span>
            </div>

            <div class="col-md-3 containerIntro">
              <span class="far fa-user fa-3x"> </span>
              <p>Profile</p>
              <br />
              <span class="border-left border-dark icons">description</span>
            </div>

            <div class="col-md-3 containerIntro">
              <span class="fa fa-industry fa-3x"> </span>
              <p>Inventory control</p>
              <br />
              <span class="border-left border-dark icons">description</span>
            </div>

            <div class="col-md-3 containerIntro">
              <span class="fa fa-users fa-3x"> </span>
              <p>Staff members</p>
              <br />
              <span class="border-left border-dark icons">description</span>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row center">
            <div class="col-md-4 containerIntro">
              <div class="card text-white bg-dark ">
                <div class="card-header">
                  Notifications
                  <span className={classes}>{notificationNum}</span>
                </div>
                <div class="card-body">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">
                    With supporting text below as a natural lead-in to
                    additional content.
                  </p>
                  <a href="#" class="btn btn-primary" onClick={handleChange}>
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
                    With supporting text below as a natural lead-in to
                    additional content.
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
                    With supporting text below as a natural lead-in to
                    additional content.
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
    </body>
  );
}

export default Home;

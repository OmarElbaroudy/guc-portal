import React, { component, useState } from "react";
import "../Home";
import "bootstrap/dist/css/bootstrap.css";
import { NavDropdown } from "react-bootstrap";
import { logoutFetcher } from "../API/logoutFetcher";
import { staffFetcher } from "../API/staffFetcher";
import { Link, Redirect } from "react-router-dom";
import { GetUser } from "./GlobalState";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function NavBar() {
  const { user } = GetUser();
  const [redirect, setRedirect] = useState("");
  const [showAccept, setShowAccept] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordText, setPasswordText] = useState("Enter new password");

  const handleClose1 = () => setShowAccept(false);
  const handleShow1 = () => setShowAccept(true);

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
  };
  const logOut = async () => {
    const l = await logoutFetcher.logout(user.token);
    setRedirect("/");
  };
  const resetPassword = async () => {
    if (newPassword.length < 6)
      return setPasswordText(
        "the password is less than 6 digits this is not possible"
      );

    const p = await staffFetcher.resetPassword(newPassword, user.token);
    setPasswordText("password updated successfully");
  };

  if (redirect) return <Redirect to={Redirect} />;
  return (
    <div>
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
        <nav class="col-xl-12 navbar navbar-expand-lg navbar-dark bg-dark">
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
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="http://localhost:3001/homePage/"
                >
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Link
                </a>
              </li>
              <NavDropdown title="privacy" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Update profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShow1} href="#action/3.2">
                  Reset password
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">not yet</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">not yet</NavDropdown.Item>
              </NavDropdown>
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
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="/"
                  onClick={logOut}
                >
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Modal
        show={showAccept}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            rows="3"
            type="password"
            placeholder="Enter new password"
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          />
          <Form.Text className="text-muted">{passwordText}</Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button onClick={resetPassword} variant="primary">
            confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NavBar;

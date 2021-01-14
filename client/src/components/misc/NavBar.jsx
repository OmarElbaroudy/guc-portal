import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavDropdown } from "react-bootstrap";
import { logoutFetcher } from "../../API/logoutFetcher";
import { staffFetcher } from "../../API/staffFetcher";
import { Redirect } from "react-router-dom";
import { GetUser } from "../common/GlobalState";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import UpdateProfile from "../staff/UpdateProfile";
import { useHistory } from "react-router-dom";
import "../../views/navbar.css";

function NavBar() {
  const { user } = GetUser();
  const [redirect, setRedirect] = useState("");
  const [showAccept, setShowAccept] = useState(false);
  const [showA, setShowA] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordText, setPasswordText] = useState("Enter new password");
  const history = useHistory();

  const handleClose1 = () => setShowAccept(false);
  const handleShow1 = () => setShowAccept(true);
  const handleShowA = () => setShowA(true);
  const handleCloseA = () => setShowA(false);

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
  };
  const logOut = async () => {
    await logoutFetcher.logout(user.token);
    setRedirect("/");
  };
  const resetPassword = async () => {
    if (newPassword.length < 6)
      return setPasswordText(
        "the password is less than 6 digits this is not possible"
      );

    await staffFetcher.resetPassword(newPassword, user.token);
    setPasswordText("password updated successfully");
  };

  if (redirect) {
    history.push(history.location.pathname);
    return <Redirect to={Redirect} />;
  }
  return (
    <div className="w-100">
      <div
        style={{ backgroundColor: "#B4CDCD" }}
        id="mySidenav"
        className="sidenav"
      >
        <button
          type="button"
          style={{ backgroundColor: "#B4CDCD" }}
          className="btn closebtn"
          onClick={closeNav}
        >
          &times;
        </button>
        <a style={{ fontWeight: "bold", color: "black" }} href="/faq">
          FAQ
        </a>
        <a style={{ fontWeight: "bold", color: "black" }} href="/about">
          About Us
        </a>
        <a style={{ fontWeight: "bold", color: "black" }} href="/contact">
          Contact
        </a>
      </div>

      <nav
        style={{ backgroundColor: "#B4CDCD" }}
        id="main"
        class="navbar navbar-expand-md"
      >
        <button
          class="navbar-toggler fa fa-bars"
          data-toggle="collapse"
          data-target="#collapse-target"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapse-target">
          <div style={{ fontWeight: "bold" }} className="navbar-brand">
            <button type="btn-dark" href="#" onClick={openNav} className="btn">
              <span className="fa fa-bars"></span>
            </button>
            <span style={{ padding: 5 }}>GUC</span>
          </div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              <li className="nav-item">
                <a
                  style={{ color: "black", fontWeight: "bold" }}
                  className="nav-link active"
                  aria-current="page"
                  href="http://localhost:3001/staffHome/"
                >
                  Home
                </a>
              </li>
            }
            <NavDropdown title="preferences" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1" onClick={handleShowA}>
                Update profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleShow1} href="#action/3.2">
                Reset password
              </NavDropdown.Item>
            </NavDropdown>
            {user.type === "academic" && (
              <NavDropdown
                style={{ color: "black" }}
                title="navigate"
                id="basic-nav-dropdown"
              >
                {user.hod && (
                  <NavDropdown.Item href="/hodHome">
                    Head of Department
                  </NavDropdown.Item>
                )}

                {user.instructor && (
                  <NavDropdown.Item href="/instructorHome">
                    Instructor
                  </NavDropdown.Item>
                )}

                {user.academic && (
                  <NavDropdown.Item href="/academicHome">
                    Academic
                  </NavDropdown.Item>
                )}
                {user.coordinator && (
                  <NavDropdown.Item href="/coordinatorHome">
                    Coordinator
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            )}
            {user.type === "Hr" && (
              <NavDropdown title="navigate" id="basic-nav-dropdown">
                <NavDropdown.Item href="/hrHome">
                  Human Resource
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <li className="nav-item">
              <a
                style={{ color: "black", fontWeight: "bold" }}
                className="nav-link active"
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
      <Modal size="md" show={showA} onHide={handleCloseA}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateProfile handleClose={handleCloseA}></UpdateProfile>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseA}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NavBar;

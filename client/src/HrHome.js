import NavBar from "./components/NavBar";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import SignInOut from "./components/SignInOut";
import ViewAttendanceRecord from "./components/ViewAttendanceRecords";

const HrHome = () => {
  const [redirect, setRedirect] = useState(null);
  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseA = () => setShowA(false);
  const handleShow = () => setShow(true);
  const handleShowA = () => setShowA(true);

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div style={{ marginTop: 100 }}>
      <NavBar />
      <Modal size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>SignIn/Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignInOut handleClose={handleClose}></SignInOut>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showA} onHide={handleCloseA}>
        <Modal.Header closeButton>
          <Modal.Title>View Staff Member Attendance Records</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ViewAttendanceRecord></ViewAttendanceRecord>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseA}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div class="row center offset-1">
        <div class="col-md-4 containerIntro">
          <button
            onClick={() => setRedirect("/hr/Locations")}
            type="button"
            href="/hr/Locations"
            class="btn"
          >
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
          <button
            onClick={() => setRedirect("/hr/Faculties")}
            type="button"
            href="/hr/Faculties"
            class="btn"
          >
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
          <button
            onClick={() => setRedirect("/hr/Departments")}
            type="button"
            href="/hr/Departments"
            class="btn"
          >
            <span class="fa fa-university fa-3x"> </span>
          </button>
          <p>Departments</p>
          <br />
          <span class="icons">
            view, add, update, delete,
            <br /> and assign head to the department
          </span>
        </div>

        <div style={{ marginTop: 50 }} class="col-md-4 containerIntro">
          <button
            onClick={() => setRedirect("/hr/Courses")}
            type="button"
            href="/hr/Courses"
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

        <div style={{ marginTop: 50 }} class="col-md-4 containerIntro">
          <button onClick={handleShow} type="button" class="btn">
            <span class="fas fa-edit fa-3x"> </span>
          </button>
          <p>SignIn/Out</p>
          <br />
          <span class="icons">
            sign in or out for
            <br />
            another staff member
          </span>
        </div>

        <div style={{ marginTop: 50 }} class="col-md-4 containerIntro">
          <button
            onClick={() => setRedirect("/hr/StaffMembers")}
            type="button"
            href="/hr/StaffMembers"
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
        <div style={{ marginTop: 75 }} class="col-md-4 containerIntro">
          <button onClick={handleShowA} type="button" class="btn">
            <span class="fas fa-address-card fa-3x"> </span>
          </button>
          <p>Attendance Records</p>
          <br />
          <span class="icons">
            view attendance records
            <br /> &nbsp; &nbsp; of another staff member
          </span>
        </div>

        <div style={{ marginTop: 75 }} class="col-md-4 containerIntro">
          <button
            onClick={() => setRedirect("/hr/missingDays")}
            type="button"
            class="btn"
          >
            <span class="fas fa-calendar-times fa-3x"> </span>
          </button>
          <p>Missing Days</p>
          <br />
          <span class="icons">
            view all staff members
            <br />
            &nbsp; &nbsp; &nbsp; &nbsp; with missing days
          </span>
        </div>

        <div style={{ marginTop: 75 }} class="col-md-4 containerIntro">
          <button
            onClick={() => setRedirect("/hr/missingHours")}
            type="button"
            class="btn"
          >
            <span class="fas fa-user-clock fa-3x"> </span>
          </button>
          <p>Missing Hours</p>
          <br />
          <span class="icons">
            view all staff members
            <br /> &nbsp; &nbsp; &nbsp; &nbsp; with missing hours
          </span>
        </div>
      </div>
    </div>
  );
};
export default HrHome;

import React, { useState, useEffect } from "react";
import NavBar from "../misc/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { GetUser } from "../common/GlobalState";
import { staffFetcher } from "../../API/staffFetcher";
import AttendanceRecord from "../academic/AttendanceRecord";
import Profile from "../common/Profile";
import "../../views/btn.css";

const StaffHome = () => {
  const { user } = GetUser();
  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [showC, setShowC] = useState(false);
  const [message, setMessage] = useState("");
  const [missingHours, setMissingHours] = useState(0);
  const [missingDays, setMissingDays] = useState(0);
  const [variant, setVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleClose = () => setShow(false);
  const handleCloseA = () => setShowA(false);
  const handleCloseB = () => setShowB(false);
  const handleCloseC = () => setShowC(false);
  const handleShow = () => setShow(true);
  const handleShowA = () => setShowA(true);
  const handleShowB = () => setShowB(true);
  const handleShowC = () => setShowC(true);

  useEffect(() => {
    const getNotifications = async () => {
      const data = await staffFetcher.getNotifications(user.token);
      console.log(data);
      const flag = data.accepted > 0 || data.rejected > 0 || !data.altered;
      if (flag) {
        setNotification(data);
        setShowNotification(true);
      }
    };
    getNotifications();
  }, [user.token]);

  const getTime = (h) => {
		const time = h * 60;
		const hours = Math.floor(time / 60);
    const minutes = time - hours * 60;
    return {hours : hours , minutes : minutes};
  }

  const signIn = async () => {
    const data = await staffFetcher.signIn(user.token);
    setMessage(data.message);
    setVariant(data.variant);
    setShowAlert(true);
  };

  const signOut = async () => {
    const data = await staffFetcher.signOut(user.token);
    setMessage(data.message);
    setVariant(data.variant);
    setShowAlert(true);
  };

  const showMissingDays = async () => {
    const data = await staffFetcher.missingDays(user.token);
    setMissingDays(data);
    handleShowA();
  };

  const showMissingHours = async () => {
    const data = await staffFetcher.missingHours(user.token);
    setMissingHours(data);
    handleShowB();
  };

  const showProfile = async () => {
    const data = await staffFetcher.viewProfile(user.token);
    setProfile(data);
    handleShowC();
  };

  return (
    <div>
      <NavBar />
      <Alert
        class=".col-6"
        variant={variant}
        show={showAlert}
        onClose={() => setShowAlert(false)}
        dismissible
      >
        {message}
      </Alert>
      <Alert
        className="col-12"
        variant="warning"
        show={showNotification}
        onClose={() => {
          setNotification(null);
          setShowNotification(false);
        }}
        dismissible
      >
        {notification && notification.accepted > 0 && (
          <h5>
            you have {notification.accepted} requests that have been accepted!
          </h5>
        )}
        {notification && notification.rejected > 0 && (
          <h5>
            you have {notification.rejected} requests that have been rejected!
          </h5>
        )}
        {notification && !notification.altered && (
          <h5>please change your password</h5>
        )}
      </Alert>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Attendance Records</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AttendanceRecord></AttendanceRecord>
        </Modal.Body>
        <Modal.Footer>
          <Button id="close" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="sm" show={showA} onHide={handleCloseA}>
        <Modal.Header closeButton>
          <Modal.Title>Missing Days</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          number of missing days is <strong>{missingDays}</strong> days
        </Modal.Body>
        <Modal.Footer>
          <Button id="close" onClick={handleCloseA}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="sm" show={showB} onHide={handleCloseB}>
        <Modal.Header closeButton>
          <Modal.Title>
            {missingHours >= 0 ? "Missing Hours" : "Extra Hours"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {missingHours >= 0 ? "Missing Hours " : "Extra Hours "} is{" "}
          <strong>{getTime(missingHours).hours}</strong> hours{" "}
          <strong>{getTime(missingHours).minutes}</strong> minutes
        </Modal.Body>
        <Modal.Footer>
          <Button id="close" onClick={handleCloseB}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={showC} onHide={handleCloseC}>
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profile && (
            <Profile
              name={profile.name}
              email={profile.email}
              salary={profile.salary}
              id={profile.id}
              accidentalLeaveBalance={profile.accidentalLeaveBalance.balance}
              annualLeaveBalance={profile.annualLeaveBalance.balance}
              gender={profile.gender}
              personalInfo={profile.personalInfo}
              department={profile.departmentId}
              location={profile.officeLocationId}
              faculty={profile.facultyId}
              dayOff={profile.dayOff}
            ></Profile>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button id="close" onClick={handleCloseC}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div class="container-fluid">
        <div class="col col-12 head containerIntro">
          <h1>Home</h1>
          <span className="m-2">Welcome</span>
        </div>
        <div class="container">
          <div class="row center">
            <div class="col-md-3 containerIntro">
              <button type="button" href="#" class="btn">
                <span
                  class="far fa-clipboard fa-3x"
                  href="#"
                  onClick={handleShow}
                ></span>
              </button>
              <p>Attendance Records</p>
              <br />
              <span class=" border-dark icons">view attendance records</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button type="button" href="#" class="btn" onClick={showProfile}>
                <span class="far fa-user fa-3x"> </span>
              </button>
              <p>Profile</p>
              <br />
              <span class=" border-dark icons">view profile</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button
                type="button"
                href="#"
                class="btn"
                onClick={showMissingDays}
              >
                <span class="far fa-calendar-times fa-3x"> </span>
              </button>
              <p>Missing Days</p>
              <br />
              <span class=" border-dark icons">view missing days</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button
                type="button"
                href="#"
                class="btn"
                onClick={showMissingHours}
              >
                <span class="far fa-clock fa-3x"> </span>
              </button>
              <p>Missing/Extra hours</p>
              <br />
              <span class=" border-dark icons">view missing/extra hours</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="container">
          <div class="row center">
            <div class="offset-md-3 col-md-3 containerIntro">
              <button type="button" href="#" class="btn" onClick={signIn}>
                <span class="fas fa-sign-in-alt fa-3x"> </span>
              </button>
              <p>Sign In</p>
              <br />
              <span class=" border-dark icons">sign in</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button type="button" href="#" class="btn" onClick={signOut}>
                <span class="fas fa-sign-out-alt fa-3x"> </span>
              </button>
              <p>Sign Out</p>
              <br />
              <span class=" border-dark icons">sign out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffHome;

import React, { useState, useEffect } from "react";
import { GetUser } from "../common/GlobalState";
import { academicFetcher } from "../../API/academicFetcher";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "../misc/NavBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Schedule from "../common/Schedule";
import RequestForm from "../academic/RequestForm";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "../../views/btn.css";

const AcademicHome = () => {
  const { user } = GetUser();
  const [show, setShow] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [comp, setComp] = useState("");
  const history = useHistory();

  const handleClose = () => setShow(false);

  const handleShow = (comp) => {
    setComp(comp);
    setShow(true);
  };

  useEffect(() => {
    const data = async () => {
      try {
        const res = await academicFetcher.viewSchedule(user.token);
        setSessions(res);
      } catch (err) {
        console.log(err);
      }
    };

    data();
  }, [user.token]);

  if (redirect) {
    history.push("/academicHome");
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <NavBar></NavBar>
      <div class="container-fluid">
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {comp === "schedule" ? "Schedule" : "Request Form"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {comp === "schedule" ? (
              <Schedule sessions={sessions}></Schedule>
            ) : (
              <RequestForm close={handleClose}></RequestForm>
            )}
          </Modal.Body>
          <Modal.Footer>
            {true ? (
              <Button id="close" onClick={handleClose}>
                Close
              </Button>
            ) : null}
          </Modal.Footer>
        </Modal>
        <div class="col col-12 head containerIntro">
          <h1>Academic Utilities</h1>
        </div>
        <div class="container">
          <div class="row center">
            <div class="col-md-3 containerIntro">
              <button
                type="button"
                href="#"
                onClick={() => {
                  handleShow("schedule");
                }}
                class="btn"
              >
                <span class="far fa-calendar-alt fa-3x" href="#"></span>
              </button>
              <p>Schedule</p>
              <br />
              <span class="border-dark icons">view schedule</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button
                type="button"
                href="#"
                onClick={() => {
                  handleShow("request");
                }}
                class="btn"
              >
                <span class="far fa-paper-plane fa-3x"> </span>
              </button>
              <p>Send Request</p>
              <br />
              <span class="border-dark icons">send request</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button
                type="button"
                href="#"
                class="btn"
                onClick={() => {
                  setRedirect("/academicHome/replacementRequests");
                }}
              >
                <span class="fas fa-exchange-alt fa-3x"> </span>
              </button>
              <p>Replacement Requests</p>
              <br />
              <span class="border-dark icons">view replacement requests</span>
            </div>

            <div class="col-md-3 containerIntro">
              <button
                type="button"
                href="#"
                class="btn"
                onClick={() => {
                  setRedirect("/academicHome/submittedRequests");
                }}
              >
                <span class="far fa-envelope fa-3x"> </span>
              </button>
              <p>Submitted Requests</p>
              <br />
              <span class="border-dark icons">view submitted requests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicHome;

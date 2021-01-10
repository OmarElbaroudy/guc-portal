import React, { useEffect, useState } from "react";
import { GetUser } from "../GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../NavBar";
import { instructorFetcher } from "../../API/instructorFetcher";
import Schedule from "../Schedule";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Courses = () => {
  const { user } = GetUser();
  const handleClose1 = () => setShowAdd(false);
  const handleShow1 = () => setShowAdd(true);
  const [showAdd, setShowAdd] = useState(false);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    const data = async () => {
      try {
        const res = await instructorFetcher.viewCourseCoverage(user.token);
        console.log("res" + res);
        setCourses(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

  const slotAss = async () => {
    const res = await instructorFetcher.viewCourseAss(user.token);
    for (const entry of res) {
      if (entry.course === courseName) setSchedule(entry.AssignedSlots);
    }
    handleShow1();
  };

  return (
    <div style={{ marginTop: 100 }}>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Courses
      </h1>

      <div class="col-7 offset-4">
        <table class="table">
          <thead>
            <tr class="d-flex">
              <th class="col-2"> Course name </th>
              <th class="col-4"> Course coverage </th>
              <th class="col-2"> Course slot's assignment </th>
            </tr>
          </thead>

          <tbody>
            {courses.map((obj) => {
              return (
                <tr class="d-flex">
                  <td class="col-2">{obj.course}</td>
                  <td class="col-4" style={{ textAlign: "center" }}>
                    {obj.coverage}
                  </td>
                  <td class="col-2">
                    <button
                      onClick={() => {
                        slotAss();
                        setCourseName(obj.course);
                      }}
                    >
                      {" "}
                      view course schedule
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{courseName} schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Schedule sessions={schedule} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose1();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Courses;

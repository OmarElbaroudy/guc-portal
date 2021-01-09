import React, { useEffect, useState } from "react";
import { GetUser } from "../GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../NavBar";
import { instructorFetcher } from "../../API/instructorFetcher";
// import Schedule from "../Schedule";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
import StaffTemp from "./StaffTemp";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const ViewStaff = () => {
  const { user } = GetUser();
  const [type, setType] = useState("department");
  const [staff, setStaff] = useState([]);
  const [alertColor, setAlertColor] = useState("danger");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("oops something went wrong");
  const [spinner, setSpinner] = useState(false);
  const [spinner1, setSpinner1] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [spinner3, setSpinner3] = useState(false);
  const [spinner4, setSpinner4] = useState(false);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await instructorFetcher.viewStaff(type, user.token);
        setStaff(res[0].Staff);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [type]);

  const assign = async (course, academic, location, weekDay, slot, type) => {
    setSpinner(true);
    const res = await instructorFetcher.assignSlot(
      course,
      academic,
      location,
      weekDay,
      slot,
      type,
      user.token
    );
    if (res === "Assignment made successfully") {
      setSpinner(false);
      setAlertColor("success");
      setShowAlert(true);
      setMessage(res);
      return;
    } else {
      setSpinner(false);
      setShowAlert(true);
      setMessage(res);
      return;
    }
  };

  const dlete = async (course, academic, location, weekDay, slot, type) => {
    setSpinner1(true);
    const res = await instructorFetcher.deleteSlot(
      course,
      academic,
      location,
      weekDay,
      slot,
      type,
      user.token
    );
    if (res === "Assignment deleted successfully") {
      setSpinner1(false);
      setAlertColor("success");
      setShowAlert(true);
      setMessage(res);
      return;
    } else {
      setSpinner1(false);
      setShowAlert(true);
      setMessage(res);
      return;
    }
  };

  const update = async (
    academicNew,
    course,
    academicOld,
    location,
    weekDay,
    slot,
    type
  ) => {
    setSpinner2(true);
    const res = await instructorFetcher.updateSlot(
      academicNew,
      course,
      academicOld,
      location,
      weekDay,
      slot,
      type,
      user.token
    );
    if (res === "Assignment updated successfully") {
      setSpinner2(false);
      setAlertColor("success");
      setShowAlert(true);
      setMessage(res);
      return;
    } else {
      setSpinner2(false);
      setShowAlert(true);
      setMessage(res);
      return;
    }
  };

  const deleteAcademic = async (course, academic) => {
    setSpinner3(true);
    const res = await instructorFetcher.deleteAcademic(
      academic,
      course,
      user.token
    );
    console.log("res " + res);
    if (
      res === "you are not an instructor of this course" ||
      res === "Wrong course name"
    ) {
      setSpinner3(false);
      setShowAlert(true);
      setMessage(res);
      return;
    }
    var newStaff = [...staff];
    var foundIndex = newStaff.findIndex((x) => x.id === res.id);
    newStaff[foundIndex] = res;
    setStaff(newStaff);
    setSpinner3(false);
  };

  const setCoordinator = async (course, academic) => {
    setSpinner4(true);
    const res = await instructorFetcher.setCoordinator(
      academic,
      course,
      user.token
    );
    console.log("hoa da " + res);
    if (
      res === "this course doesn't exist" ||
      res === "You are not the instructor of this course" ||
      res === "This academic either doesn't exist or doesn't teach this course"
    ) {
      setSpinner4(false);
      setShowAlert(true);
      setMessage(res);
      return;
    }
    var newStaff = [...staff];
    var foundIndex = newStaff.findIndex((x) => x.id === res.id);
    newStaff[foundIndex] = res;
    setStaff(newStaff);
    setSpinner4(false);
  };
  return (
    <div>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Staff Members
      </h1>
      <div class="col col-5 offset-3">
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>View By</Form.Label>
          <Form.Control
            as="select"
            defaultValue="hr"
            onChange={(event) => {
              setType(event.target.value);
            }}
          >
            <option value="department">department</option>
            <option value="course">course</option>
          </Form.Control>
        </Form.Group>
      </div>
      {staff.map((obj) => {
        return (
          <StaffTemp
            key={obj.id}
            name={obj.name}
            id={obj.id}
            email={obj.email}
            salary={obj.salary}
            courses={obj.courses}
            office={obj.officeLocationId}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            message={message}
            alertColor={alertColor}
            handleAssign={assign}
            handleDelete={dlete}
            handleUpdate={update}
            handleDeleteAcademic={deleteAcademic}
            handleCord={setCoordinator}
            spinner={spinner}
            spinner1={spinner1}
            spinner2={spinner2}
            spinner3={spinner3}
            spinner4={spinner4}
          />
        );
      })}
    </div>
  );
};
export default ViewStaff;

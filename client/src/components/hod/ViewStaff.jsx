import React, { useEffect, useState } from "react";
import { GetUser } from "../common/GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import StaffMember from "./StaffMember";
import NavBar from "../misc/NavBar";
import { hodFetcher } from "../../API/hodFetcher";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

const ViewStaff = () => {
  const { user } = GetUser();
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("oops something went wrong");
  const [spinner, setSpinner] = useState(false);
  const [spinner1, setSpinner1] = useState(false);

  useEffect(() => {
    const data = async () => {
      setSpinner(true);
      try {
        const res = await hodFetcher.view(filter, user.token);
        setStaff(res);
        setSpinner(false);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [filter, user.token]);

  const addCourse = async (course, staffMem, type) => {
    setSpinner1(true);
    console.log("course " + course + " staff " + staffMem + " type " + type);
    const res = await hodFetcher.addCourse(course, staffMem, user.token, type);
    if (res === "wrong course") {
      setShowAlert(true);
      setMessage("wrong course name or type");
      setSpinner1(false);
      return;
    }
    var newStaff = [...staff];
    var foundIndex = newStaff.findIndex((x) => x.id === res.id);
    newStaff[foundIndex] = res;
    setStaff(newStaff);
    setSpinner1(false);
  };

  const deleteCourse = async (course, staffMem, type) => {
    setSpinner1(true);
    console.log("course " + course + " staff " + staffMem + " type " + type);
    const res = await hodFetcher.deleteCourse(course, staffMem, user.token);
    if (res === "wrong course") {
      setShowAlert(true);
      setMessage("wrong course name");
      setSpinner1(false);
      return;
    }
    var newStaff = [...staff];
    var foundIndex = newStaff.findIndex((x) => x.id === res.id);
    newStaff[foundIndex] = res;
    setStaff(newStaff);
    setSpinner1(false);
  };

  const updateCourse = async (course, staffMemOld, staffMemNew) => {
    setSpinner1(true);
    const res = await hodFetcher.updateCourse(
      course,
      staffMemOld,
      staffMemNew,
      user.token
    );
    if (res === "wrong course") {
      setShowAlert(true);
      setMessage("wrong course name or staff id");
      setSpinner1(false);
      return;
    }
    var newStaff = [...staff];
    var foundIndex1 = newStaff.findIndex((x) => x.id === res.old.id);
    var foundIndex2 = newStaff.findIndex((x) => x.id === res.new.id);
    newStaff[foundIndex1] = res.old;
    newStaff[foundIndex2] = res.new;
    setStaff(newStaff);
    setSpinner1(false);
  };

  const viewDayOff = async (id) => {
    const res = await hodFetcher.viewDayOff(id, user.token);
    return res;
  };

  return (
    <div>
      <NavBar sticky="top" />
      <h1 style={{ fontWeight: "bold", padding: 50 }} class="display-6">
        Staff Members
      </h1>
      <div class="col col-4 offset-4">
        <Form inline style={{ marginBottom: 20 }}>
          <Form.Group>
            {spinner ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            <Form.Label htmlFor="inputPassword6">course</Form.Label>
            <Form.Control
              onChange={(event) => {
                console.log(filter);
                setFilter(event.target.value);
              }}
              className="mx-sm-3"
              id="inputPassword6"
              aria-describedby="passwordHelpInline"
            />
            <Form.Text id="passwordHelpBlock" muted>
              to filter by course name.
            </Form.Text>
          </Form.Group>
        </Form>
      </div>
      {staff.map((obj) => {
        return (
          <StaffMember
            key={obj.id}
            name={obj.name}
            id={obj.id}
            email={obj.email}
            salary={obj.salary}
            courses={obj.courses}
            dayOff={obj.dayOff}
            office={obj.officeLocationId}
            handleAdd={addCourse}
            handleDelete={deleteCourse}
            handleUpdate={updateCourse}
            handleDayOff={viewDayOff}
            spinner={spinner1}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            message={message}
          />
        );
      })}
    </div>
  );
};
export default ViewStaff;

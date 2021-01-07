import React, { useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import StaffMember from "./StaffMember";
import NavBar from "./NavBar";
import { hodFetcher } from "../API/hodFetcher";
import Form from "react-bootstrap/Form";

const ViewStaff = () => {
  const { user } = GetUser();
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const data = async () => {
      try {
        const res = await hodFetcher.view(filter, user.token);
        setStaff(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, [filter, user.token]);

  const addCourse = async (course, staffMem, type) => {
    console.log("course " + course + " staff " + staffMem + " type " + type);
    const res = await hodFetcher.addCourse(course, staffMem, user.token, type);
    var newStaff = [...staff];
    var foundIndex = newStaff.findIndex((x) => x.id === res.id);
    newStaff[foundIndex] = res;
    setStaff(newStaff);
  };

  const deleteCourse = async (course, staffMem, type) => {
    console.log("course " + course + " staff " + staffMem + " type " + type);
    const res = await hodFetcher.deleteCourse(course, staffMem, user.token);
    var newStaff = [...staff];
    var foundIndex = newStaff.findIndex((x) => x.id === res.id);
    newStaff[foundIndex] = res;
    setStaff(newStaff);
  };

  const updateCourse = async (course, staffMemOld, staffMemNew) => {
    const res = await hodFetcher.updateCourse(
      course,
      staffMemOld,
      staffMemNew,
      user.token
    );
    var newStaff = [...staff];
    var foundIndex1 = newStaff.findIndex((x) => x.id === res.old.id);
    var foundIndex2 = newStaff.findIndex((x) => x.id === res.new.id);
    newStaff[foundIndex1] = res.old;
    newStaff[foundIndex2] = res.new;
    setStaff(newStaff);
  };

  const viewDayOff = async (id) => {
    const res = await hodFetcher.viewDayOff(id, user.token);
    return res;
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Staff Members
      </h1>
      <div class="col col-4 offset-4">
        <Form inline style={{ marginBottom: 20 }}>
          <Form.Group>
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
          />
        );
      })}
    </div>
  );
};
export default ViewStaff;

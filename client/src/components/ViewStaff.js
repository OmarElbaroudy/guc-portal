import React, { useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import StaffMember from "./StaffMember";
import NavBar from "./NavBar";
import { hodFetcher } from "../API/hodFetcher";

const ViewStaff = () => {
  const { user } = GetUser();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await hodFetcher.view("", user.token);
        setStaff(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

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

  return (
    <div>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Staff Members
      </h1>
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
            handleAdd={addCourse}
            handleDelete={deleteCourse}
          />
        );
      })}
    </div>
  );
};
export default ViewStaff;

import React, { useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import StaffMember from "./StaffMember";
import NavBar from "./NavBar";
import { hodFetcher } from "../API/hodFetcher";
import Form from "react-bootstrap/Form";

const CourseCoverage = () => {
  const { user } = GetUser();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const data = async () => {
      try {
        const res = await hodFetcher.viewCourseCoverage(user.token);
        console.log("res" + res);
        setCourses(res);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);
  return (
    <React.Fragment>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Courses coverage
      </h1>
      <div class="col-7 offset-4">
        <table class="table">
          <thead>
            <tr class="d-flex">
              <th class="col-2"> Course name </th>
              <th class="col-4"> Course coverage </th>
            </tr>
          </thead>

          <tbody>
            {courses.map((obj) => {
              return (
                <tr class="d-flex">
                  <td class="col-2">{obj.course}</td>
                  <td class="col-4">{obj.coverage}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};
export default CourseCoverage;

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../misc/NavBar";

const FAQ = () => {
  return (
    <React.Fragment>
      <NavBar sticky="top" />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Frequently Asked Questions
      </h1>
      <div class="col-8 offset-2">
        <dl>
          <dt style={{ marginBottom: 5 }}>
            What does the green (add HR) button in the login page do?
          </dt>
          <dd>
            This button can only be clicked when the database is empty to add
            the first hr member. If the data base is not empty the user will not
            be allowed to add the hr member.
          </dd>
          <br></br>
          <dt style={{ marginBottom: 5 }}>
            How can I navigate within the website?
          </dt>
          <dd>
            Go to the nav bar at the top click the navigate menu and you will be
            prompted with the pages that you are allowed to view{" "}
            <i style={{ color: "red" }}>
              note that you are only allowed to view the utilities of a specific
              academic member only if you have at least one course with the
              required position
            </i>{" "}
            (e.g) in order to view the instructor utilities you have to be
            instructor to at least one course.
          </dd>
          <br></br>
          <dt style={{ marginBottom: 5 }}>
            When is the compensation leave calculated in missing days and hours?
          </dt>
          <dd>
            In order to deduct compensation leave from missing hours you have to
            attend a day off after the request has been accepted then the day
            off will appear in the attendance record as compensation which means
            it has been calculated in the missing hours of the month other
            leaves if accepted will automatically be calculated in the missing
            hours.
          </dd>
          <br></br>
          <dt style={{ marginBottom: 5 }}>
            Can I be a coordinator to more than 1 course?
          </dt>
          <dd>
            No you can't, the only restriction in assigning courses to academic
            members is that each academic member is only allowed to be a
            coordinator of maximum 1 course (e.g) : <br></br>
            <i>
              you can be instructor, coordinator and academic of the same course{" "}
            </i>
            <br></br>
            <i>
              you can be instructor of 2 courses and coordinator of another
              course
            </i>
          </dd>
          <br></br>
        </dl>
      </div>
    </React.Fragment>
  );
};
export default FAQ;

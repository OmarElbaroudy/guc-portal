import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../misc/NavBar";

const FAQ = () => {
  return (
    <React.Fragment>
      <NavBar sticky="top" />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Requests
      </h1>
      <div class="col-8 offset-2">
        <dl>
          <dt>First INFO.</dt>
          <dd>
            In order to deduct compensation leave from missing hours you have to
            attend a day off after the request has been accepted then the day
            off will appear in the attendance record as compensation which means
            it has been calculated in the missing hours of the month other
            leaves if accepted will automatically be calculated in the missing
            hours
          </dd>
          <dt>First INFO.</dt>
          <dd>
            In order to deduct compensation leave from missing hours you have to
            attend a day off after the request has been accepted then the day
            off will appear in the attendance record as compensation which means
            it has been calculated in the missing hours of the month other
            leaves if accepted will automatically be calculated in the missing
            hours
          </dd>
        </dl>
      </div>
    </React.Fragment>
  );
};
export default FAQ;

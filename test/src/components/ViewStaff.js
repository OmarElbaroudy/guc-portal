import React, { useState } from "react";
import { GetUser } from "../GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewStaff = () => {
  const { user, setUser } = GetUser();
  const [course, setCourse] = useState("");
};
export default ViewStaff;

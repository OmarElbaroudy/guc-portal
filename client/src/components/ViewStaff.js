import React, { useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import StaffMember from "./StaffMember";
import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import {hodFetcher} from "../API/hodFetcher";

const ViewStaff = () => {
  const { user, setUser } = GetUser();
  
  return (
    <div>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Staff Members
      </h1>
      <Button
        onClick={() => {
          hodFetcher.view("",user.token);
        }}
        variant="primary"
      >
        Primary
      </Button>
      <StaffMember />
    </div>
  );
};
export default ViewStaff;
import "./App.css";
import React from "react";
import HodHome from "./HodHome";
import HrHome from "./HrHome";
import { UserProvider } from "./components/GlobalState";
import Login from "./components/Login";
import ViewStaff from "./components/ViewStaff";
import ViewRequest from "./components/ViewRequests";
import CourseCoverage from "./components/CourseCoverage";
import viewProfile from "./components/ViewProfile";
import StaffHome from "./StaffHome";
import HrStaffMember from "./components/HrStaffMember"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/hodHome" component={HodHome} />
          <Route exact path="/staffHome" component={StaffHome} />
          <Route exact path="/hrHome" component={HrHome} />
          <Route exact path="/homePage/requests" component={ViewRequest} />
          <Route exact path="/homePage/staffMembers" component={ViewStaff} />
          <Route exact path="/staffHome/viewProfile" component={viewProfile} />
          <Route exact path="/hr/StaffMembers" component={HrStaffMember} />
          <Route
            exact
            path="/homePage/coursesCoverage"
            component={CourseCoverage}
          />
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;

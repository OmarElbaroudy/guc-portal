import "./App.css";
import React from "react";
import Home from "./Home";
import { UserProvider } from "./components/GlobalState";
import Login from "./components/Login";
import ViewStaff from "./components/ViewStaff";
import ViewRequest from "./components/ViewRequests";
import CourseCoverage from "./components/CourseCoverage";
import viewProfile from "./components/ViewProfile";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/homePage" component={Home} />
          <Route exact path="/homePage/staffMembers" component={ViewStaff} />
          <Route exact path="/homePage/viewProfile" component={viewProfile} />
          <Route exact path="/homePage/requests" component={ViewRequest} />
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

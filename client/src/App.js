import "./App.css";
import React from "react";
import { UserProvider } from "./components/GlobalState";
import Login from "./components/Login";
import ViewStaff from "./components/ViewStaff";
import ViewRequest from "./components/ViewRequests";
import CourseCoverage from "./components/CourseCoverage";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import Home from "./Home";

function App() {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/homePage" component={Home} />
          <Route exact path="/homePage/staffMembers" component={ViewStaff} />
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

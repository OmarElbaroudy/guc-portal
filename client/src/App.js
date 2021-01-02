import "./App.css";

import React from "react";
import { UserProvider } from "./GlobalState";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import Home from "./Home";
import ViewStaff from "./components/ViewStaff";
import StaffMember from "./components/StaffMember";

function App() {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/homePage" component={Home} />
          <Route exact path="/homePage/staffMembers" component={StaffMember} />
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;

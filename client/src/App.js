import "./App.css";
import React from "react";
import { UserProvider } from "./components/GlobalState";
import Login from "./components/Login";
import ViewStaff from "./components/ViewStaff";
import StaffMember from "./components/StaffMember";

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
          <Route exact path="/" component= {Login} />
          <Route exact path="/homePage" component={Home} />
          <Route exact path="/homePage/staffMembers" component={ViewStaff} />
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;

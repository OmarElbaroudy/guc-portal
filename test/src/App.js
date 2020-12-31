import "./App.css";

import React from "react";
import { UserProvider } from "./GlobalState";
import Login from "./components/Login";

function App() {
  return (
    <UserProvider>
      <Login />
    </UserProvider>
  );
}

export default App;

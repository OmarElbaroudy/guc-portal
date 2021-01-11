import React, { createContext, useContext } from "react";
import saveToLocalStorage from "../../saveToLocalStorage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = saveToLocalStorage("user", null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const GetUser = () => useContext(UserContext);

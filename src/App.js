import React, { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./js/layout/Layout";
import Home from "./js/pages/Home";
import Splash from "./js/pages/Splash";
import Login from "./js/pages/Login";
import NoPage from "./js/pages/NoPage";
import AddTherapist from "./js/pages/AddTherapist";
import AddPatient from "./js/pages/AddPatient";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const App = () => {
  const [userToken, setUserToken] = useState("");

  return (
    <AppContext.Provider value={{ userToken, setUserToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addtherapist" element={<AddTherapist />} />
            <Route path="/addpatient" element={<AddPatient />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;

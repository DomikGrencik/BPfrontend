import React, { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./js/layout/Layout";
import Home from "./js/pages/Home";
import Splash from "./js/pages/Splash";
import Login from "./js/pages/Login";
import NoPage from "./js/pages/NoPage";
import AddTherapist from "./js/pages/AddTherapist";
import AddPatient from "./js/pages/AddPatient";
import Patient from "./js/pages/Patient";
import Therapist from "./js/pages/Therapist";
import Test from "./js/pages/Test";
import { useLocalStorage } from "./js/utils/useLocalStorage";
import { STORAGE_KEY } from "./js/utils/variables";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const App = () => {
  const storage = useLocalStorage(STORAGE_KEY, { userToken: "", userId: "" });
  const [testId, setTestId] = useState("");

  if (storage) {
    const [getItem, setItem] = storage;

    return (
      <AppContext.Provider
        value={{
          getItem,
          setItem,
          testId,
          setTestId,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Splash />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/addtherapist" element={<AddTherapist />} />
              <Route path="/addpatient" element={<AddPatient />} />
              <Route path="/patient" element={<Patient />} />
              <Route path="/therapist" element={<Therapist />} />
              <Route path="/test" element={<Test />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    );
  } else {
    return <>Nastala neočakávaná chyba.</>;
  }
};

export default App;

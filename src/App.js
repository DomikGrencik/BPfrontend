import React, { createContext, useContext, useState, useMemo } from "react";
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
  const dataToStore = useMemo(
    () => ({
      userToken: "",
      userId: "",
      isAdmin: "",
      isHomeScreen: "",
      isVisibleMenuButton: "",
    }),
    []
  );
  const storage = useLocalStorage(STORAGE_KEY, dataToStore);

  const [testId, setTestId] = useState("");
  const [isVisibleProfileButton, setIsVisibleProfileButton] = useState(true);
  const [isOpenedDrawer, setIsOpenedDrawer] = useState(false);
  const [cancelNewTestButton, setCancelNewTestButton] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsOpenedDrawer(open);
  };

  if (storage) {
    const [initialize, getItem, setItem] = storage;

    return (
      <AppContext.Provider
        value={{
          initialize,
          getItem,
          setItem,
          testId,
          setTestId,
          isVisibleProfileButton,
          setIsVisibleProfileButton,
          isOpenedDrawer,
          toggleDrawer,
          cancelNewTestButton,
          setCancelNewTestButton,
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

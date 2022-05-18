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
import ShortTest from "./js/pages/ShortTest";
import { useLocalStorage } from "./js/utils/useLocalStorage";
import { STORAGE_KEY } from "./js/utils/variables";
import createPalette from "@mui/material/styles/createPalette";
import { createTheme, ThemeProvider } from "@mui/material";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const theme = createTheme({
  palette: createPalette({
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  }),
});

const App = () => {
  const dataToStore = useMemo(
    () => ({
      userToken: "",
      userId: "",
      isAdmin: "",
      isPatient: "",
      isVisibleMenuButton: "",
    }),
    []
  );
  const storage = useLocalStorage(STORAGE_KEY, dataToStore);

  const [testId, setTestId] = useState("");
  const [isOpenedDrawer, setIsOpenedDrawer] = useState(false);
  const [isShortTest, setIsShortTest] = useState(true);
  const [isEditTest, setIsEditTest] = useState(true);

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
          isOpenedDrawer,
          toggleDrawer,
          isShortTest,
          setIsShortTest,
          isEditTest, setIsEditTest
        }}
      >
        <ThemeProvider theme={theme}>
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
                <Route path="/shorttest" element={<ShortTest />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AppContext.Provider>
    );
  } else {
    return <>Nastala neočakávaná chyba.</>;
  }
};

export default App;

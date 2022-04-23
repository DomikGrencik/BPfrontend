import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./js/layout/Layout";
import Home from "./js/pages/Home";
import NoPage from "./js/pages/NoPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

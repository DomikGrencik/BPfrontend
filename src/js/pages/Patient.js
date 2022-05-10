import React, { useRef, useState, useCallback } from "react";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Patient = () => {
  const { userToken } = useAppContext();
  const navigate = useNavigate();
  console.log(userToken);

  return (
    <main className="page container--default flex--grow flex">
      <form className="page__form flex--grow flex flex--column flex--justify-center flex--align-center">
        <h2>Profil pacienta</h2>
      </form>
    </main>
  );
};

export default Patient;

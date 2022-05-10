import React, { useRef, useState, useCallback } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const AddTherapist = () => {
  const { userToken } = useAppContext();
  const RegisterData = useRef({ name: "", surename: "", password: "" });
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const navigate = useNavigate();
  console.log(userToken);

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();
      console.log(userToken);
      const response = await apiFetch({
        route: "/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: RegisterData.current,
      });
      if (response.status === 201) {
        setFormError(false);
        setFormErrorMsg("");
        navigate("/", { replace: true });
      } else {
        setFormError(true);
        setFormErrorMsg(response.data?.message);
      }
    },
    [navigate, userToken]
  );

  const cancelAction = useCallback(
    async (event) => {
      event.preventDefault();
      navigate("/", { replace: true });
    },
    [navigate]
  );

  return (
    <main className="addtherapist container--default flex--grow flex">
      <form
        onSubmit={submitForm}
        className="addtherapist__form flex--grow flex flex--column flex--justify-center flex--align-center"
      >
        <h2>Přidání logopeda</h2>
        <TextField label="Jméno" variant="outlined" />
        <TextField label="Příjmení" variant="outlined" />
        <TextField
          label="Heslo"
          variant="outlined"
          error={formError}
          helperText={formErrorMsg}
        />
        <div className="addtherapist__width flex flex--justify-space-between">
          <Button
            onClick={cancelAction}
            sx={{ width: 100, height: 56 }}
            variant="contained"
            color="error"
          >
            Zrušit
          </Button>
          <Button
            type="submit"
            sx={{ width: 100, height: 56 }}
            variant="contained"
          >
            Přidat
          </Button>
        </div>
      </form>
    </main>
  );
};

export default AddTherapist;

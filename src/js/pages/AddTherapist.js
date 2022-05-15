import React, { useRef, useCallback } from "react";
import { TextField } from "@mui/material";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const AddTherapist = () => {
  const { getItem, setItem } = useAppContext();
  const userToken = getItem("userToken");

  const TherapistData = useRef({ name: "", surename: "", password: "" });

  const navigate = useNavigate();

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apiFetch({
        route: "/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: TherapistData.current,
      });

      if (response) {
        navigate("/home", { replace: true });
      } else {
        setItem(["userToken", "userId"], "");
        navigate("/", { replace: true });
      }
    },
    [navigate, setItem, userToken]
  );

  return (
    <main className="page container--default flex--grow flex">
      <form
        onSubmit={submitForm}
        className="page__form flex--grow flex flex--column flex--justify-center flex--align-center"
      >
        <h2>Přidání logopeda</h2>
        <TextField
          onChange={(event) =>
            (TherapistData.current.name = event.target.value)
          }
          required
          label="Jméno"
          variant="outlined"
        />
        <TextField
          onChange={(event) =>
            (TherapistData.current.surename = event.target.value)
          }
          required
          label="Příjmení"
          variant="outlined"
        />
        <TextField
          onChange={(event) =>
            (TherapistData.current.password = event.target.value)
          }
          required
          label="Heslo"
          variant="outlined"
          type={"password"}
          helperText={"minimálne 8 znaků"}
          inputProps={{ minLength: 8 }}
        />
        <Fab
          onClick={() => {
            navigate("/home", { replace: true });
          }}
          sx={{ position: "fixed", bottom: 20, left: 20 }}
          color="error"
          variant="extended"
        >
          <CloseIcon sx={{ mr: 1 }} />
          zrušit
        </Fab>
        <Fab
          type="submit"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
          color="primary"
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          přidat
        </Fab>
      </form>
    </main>
  );
};

export default AddTherapist;

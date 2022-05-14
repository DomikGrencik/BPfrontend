import React, { useRef, useCallback } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
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
        setItem("userToken", "");
        setItem("userId", "");
        navigate("/", { replace: true });
      }
    },
    [navigate, setItem, userToken]
  );

  const cancelAction = useCallback(() => {
    navigate("/home", { replace: true });
  }, [navigate]);

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
        <div className="page__width flex flex--justify-space-between">
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

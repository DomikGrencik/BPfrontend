import React, { useState, useEffect, useRef, useCallback } from "react";
import { TextField } from "@mui/material";
import { Fab } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const AddTherapist = () => {
  const { initialize, getItem } = useAppContext();
  const userToken = getItem("userToken");

  const TherapistData = useRef({ name: "", surename: "" });

  const [passwordProps, setPasswordProps] = useState({
    password: "",
    passwordRepeat: "",
    showPassword: false,
  });

  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

  const handleChange = (prop) => (event) => {
    setPasswordProps({ ...passwordProps, [prop]: event.target.value });
  };

  const navigate = useNavigate();

  // Checks if password and passwordReapeat match
  useEffect(() => {
    if (passwordProps.password !== passwordProps.passwordRepeat) {
      setFormError(true);
      setFormErrorMsg("Hesla se nezhodují.");
    } else {
      setFormError(false);
      setFormErrorMsg("");
    }
  }, [passwordProps.password, passwordProps.passwordRepeat]);

  const handleClickShowPassword = () => {
    setPasswordProps({
      ...passwordProps,
      showPassword: !passwordProps.showPassword,
    });
  };

  // Adds therapist to database
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
        body: { ...TherapistData.current, password: passwordProps.password },
      });

      if (response) {
        navigate("/home", { replace: true });
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, passwordProps.password, userToken]
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
          autoComplete="off"
        />
        <TextField
          onChange={(event) =>
            (TherapistData.current.surename = event.target.value)
          }
          required
          label="Příjmení"
          variant="outlined"
          autoComplete="off"
        />
        {[
          { label: "Nové heslo", value: "password" },
          { label: "Zopakovat heslo", value: "passwordRepeat" },
        ].map(({ label, value }, index) => (
          <TextField
            key={index}
            value={passwordProps[value]}
            onChange={handleChange(value)}
            label={label}
            variant="outlined"
            type={passwordProps.showPassword ? "text" : "password"}
            error={formError}
            helperText={formErrorMsg ? formErrorMsg : "minimálne 8 znaků"}
            className="page__width"
            required
            inputProps={{ minLength: 8 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {passwordProps.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}

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
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
          }}
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

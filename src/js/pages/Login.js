import React, { useRef, useState, useCallback } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUserToken } = useAppContext();
  const loginData = useRef({ login: "", password: "" });
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const navigate = useNavigate();

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();
      const response = await apiFetch({
        route: "/login",
        method: "POST",
        body: loginData.current,
      });
      if (response.status === 200) {
        setFormError(false);
        setFormErrorMsg("");
        setUserToken(response.data?.token);
        navigate("/splash", { replace: true });
      } else {
        setFormError(true);
        setFormErrorMsg(response.data?.message);
      }
    },
    [navigate, setUserToken]
  );

  return (
    <main className="login container--default flex--grow flex">
      <form
        onSubmit={submitForm}
        className="login__form flex--grow flex flex--column flex--justify-center flex--align-center"
      >
        <h2>Přihlášení</h2>
        <TextField
          onChange={(event) => (loginData.current.login = event.target.value)}
          label="Login"
          variant="outlined"
          error={formError}
          helperText={formErrorMsg}
        />
        <TextField
          onChange={(event) =>
            (loginData.current.password = event.target.value)
          }
          label="Heslo"
          variant="outlined"
          type={"password"}
          error={formError}
          helperText={formErrorMsg}
        />
        <Button
          type="submit"
          sx={{ width: 210, height: 56 }}
          variant="contained"
        >
          Přihlásit se
        </Button>
      </form>
    </main>
  );
};

export default Login;

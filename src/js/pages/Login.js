import React, { useRef, useState, useCallback } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const { setItem } = useAppContext();
  const setUserToken = useCallback(
    (token) => setItem("userToken", token),
    [setItem]
  );
  const setIsAdmin = useCallback(
    (isAdmin) => setItem("isAdmin", isAdmin),
    [setItem]
  );

  const loginData = useRef({ login: "", password: "" });

  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apiFetch({
        route: "/login",
        method: "POST",
        body: loginData.current,
      });

      if (response) {
        setFormError(false);
        setFormErrorMsg("");
        setUserToken(response.token);

        const user = await apiFetch({
          route: "/profile",
          method: "GET",
          headers: {
            Authorization: `Bearer ${response.token}`,
          },
        });

        setIsAdmin(user.data.role.includes("admin"));

        navigate("/", { replace: true });
      } else {
        setFormError(true);
        setFormErrorMsg(response?.message);
      }
    },
    [navigate, setIsAdmin, setUserToken]
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
          required
          className="page__width"
        />
        <TextField
          onChange={(event) =>
            (loginData.current.password = event.target.value)
          }
          label="Heslo"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          error={formError}
          helperText={formErrorMsg}
          required
          className="page__width"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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

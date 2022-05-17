import React, { useEffect, useState, useCallback } from "react";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KeyIcon from "@mui/icons-material/Key";
import { IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const Therapist = () => {
  const { initialize, getItem } = useAppContext();
  const userToken = getItem("userToken");
  const userId = getItem("userId");

  const [loading, setLoading] = useState(true);
  const [isChangeName, setIsChangeName] = useState(true);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPasswordProps({
      password: "",
      passwordRepeat: "",
      showPassword: false,
    });
  };

  const [therapist, setTherapist] = useState({});
  const [newTherapist, setNewTherapist] = useState({});
  const [passwordProps, setPasswordProps] = useState({
    password: "",
    passwordRepeat: "",
    showPassword: false,
  });

  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

  const { navigate } = useNavigate();

  const handleChange = (prop) => (event) => {
    setPasswordProps({ ...passwordProps, [prop]: event.target.value });
  };

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

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: `/users/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        setLoading,
      });

      if (response) {
        setTherapist(response);
        setNewTherapist(response);
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    };
    if (userToken) {
      fetchData();
    } else {
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, userId, userToken]);

  const changeName = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apiFetch({
        route: `/users/${userId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: { name: newTherapist.name, surename: newTherapist.surename },
      });

      if (response) {
        setTherapist(newTherapist);
        handleClose();
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, newTherapist, userId, userToken]
  );

  const changePassword = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apiFetch({
        route: `/users/${userId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: { password: passwordProps.password },
      });

      if (response) {
        handleClose();
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, passwordProps.password, userId, userToken]
  );

  return loading ? (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  ) : (
    !_.isEmpty(therapist) && (
      <main className="page page__form container--default flex--grow flex flex--column flex--justify-center flex--align-center">
        <h2>Profil logopeda</h2>
        <div className="page__width">
          <List>
            <ListItem
              sx={{ height: 48 }}
              disablePadding
              secondaryAction={
                <IconButton
                  onClick={() => {
                    handleOpen();
                    setIsChangeName(true);
                  }}
                  edge="end"
                  aria-label="delete"
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <h3>{`${therapist.name} ${therapist.surename}`}</h3>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block", height: 48 }}>
              <div>login:</div>
              <h4>{therapist.login}</h4>
            </ListItem>
          </List>
          <div className="flex flex--justify-center">
            <Button
              onClick={() => {
                handleOpen();
                setIsChangeName(false);
              }}
              sx={{
                width: 210,
                height: 56,
                marginTop: 1,
              }}
              variant="outlined"
              startIcon={<KeyIcon />}
            >
              Změnit heslo
            </Button>
          </div>
        </div>

        <Modal open={open} onClose={handleClose}>
          <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
            <>
              {isChangeName ? (
                <form
                  onSubmit={changeName}
                  className="flex flex--column flex--justify-center flex--align-center page__form"
                >
                  <h4>Změnit jméno a příjmení</h4>
                  <TextField
                    onChange={(event) =>
                      setNewTherapist({
                        ...newTherapist,
                        name: event.target.value,
                      })
                    }
                    label="Jméno"
                    variant="outlined"
                    value={newTherapist.name}
                  />
                  <TextField
                    onChange={(event) =>
                      setNewTherapist({
                        ...newTherapist,
                        surename: event.target.value,
                      })
                    }
                    label="Příjmení"
                    variant="outlined"
                    value={newTherapist.surename}
                  />
                  <div className="flex flex--justify-space-between page__form">
                    <Button
                      onClick={() => {
                        setNewTherapist(therapist);
                        handleClose();
                      }}
                      type="button"
                      sx={{ width: 100 }}
                      variant="outlined"
                      size="small"
                      color="error"
                    >
                      Zrušit
                    </Button>
                    <Button
                      type="submit"
                      sx={{ width: 100 }}
                      variant="outlined"
                      size="small"
                    >
                      Změnit
                    </Button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={changePassword}
                  className="flex flex--column flex--justify-center flex--align-center page__form"
                >
                  <h4>Změnit heslo</h4>
                  {[
                    { label: "Heslo", value: "password" },
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
                      helperText={
                        formErrorMsg ? formErrorMsg : "minimálne 8 znaků"
                      }
                      className="page__width"
                      required
                      inputProps={{ minLength: 8 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
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
                  <div className="flex flex--justify-space-between page__form">
                    <Button
                      onClick={() => {
                        handleClose();
                      }}
                      type="button"
                      sx={{ width: 100 }}
                      variant="outlined"
                      size="small"
                      color="error"
                    >
                      Zrušit
                    </Button>
                    <Button
                      type="submit"
                      sx={{ width: 100 }}
                      variant="outlined"
                      size="small"
                    >
                      Změnit
                    </Button>
                  </div>
                </form>
              )}
            </>
          </Box>
        </Modal>
      </main>
    )
  );
};

export default Therapist;

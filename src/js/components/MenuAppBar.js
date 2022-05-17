import React, { useState, useCallback, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyIcon from "@mui/icons-material/Key";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Divider } from "@mui/material";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const MenuAppBar = () => {
  const {
    initialize,
    getItem,
    setItem,
    isVisibleProfileButton,
    setIsVisibleProfileButton,
    isOpenedDrawer,
    toggleDrawer,
    cancelNewTestButton,
    setCancelNewTestButton,
    testId,
    isShortTest,
  } = useAppContext();
  const userToken = getItem("userToken");
  const isPatient = getItem("isPatient");
  const isVisibleMenuButton = getItem("isVisibleMenuButton");
  const isHomeScreen = getItem("isHomeScreen");

  const setIsVisibleMenuButton = useCallback(
    (isVisibleMenuButton) =>
      setItem("isVisibleMenuButton", isVisibleMenuButton),
    [setItem]
  );
  const setIsHomeScreen = useCallback(
    (isHomeScreen) => setItem("isHomeScreen", isHomeScreen),
    [setItem]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState({});

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

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

  // Gets general data of logged in user
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: "/profile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        setProfile(response.data);
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    };
    if (userToken) {
      fetchData();
    } else {
      if (userToken) {
        navigate("/", { replace: true });
      }
    }
  }, [initialize, navigate, userToken]);

  // Changes password of logged in user
  const changePassword = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apiFetch({
        route: `/users/${profile.id}`,
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
    [initialize, navigate, passwordProps.password, profile.id, userToken]
  );

  // Logs out user, clears local storage
  const handleLogout = useCallback(async () => {
    await apiFetch({
      route: "/logout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    initialize();
    navigate("/", { replace: true });
  }, [initialize, navigate, userToken]);

  // Deletes test
  const deleteTest = useCallback(async () => {
    const response = await apiFetch({
      route: `/tests/${testId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      handleCloseModal();
      setCancelNewTestButton(false);
      setIsVisibleProfileButton(true);
      setIsVisibleMenuButton(true);
      navigate("/patient", { replace: true });
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [
    initialize,
    navigate,
    setCancelNewTestButton,
    setIsVisibleMenuButton,
    setIsVisibleProfileButton,
    testId,
    userToken,
  ]);

  // Deletes short test
  const deleteShortTest = useCallback(async () => {
    const response = await apiFetch({
      route: `/short_tests/${testId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      handleCloseModal();
      setCancelNewTestButton(false);
      setIsVisibleProfileButton(true);
      setIsVisibleMenuButton(true);
      navigate("/patient", { replace: true });
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [
    initialize,
    navigate,
    setCancelNewTestButton,
    setIsVisibleMenuButton,
    setIsVisibleProfileButton,
    testId,
    userToken,
  ]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {userToken && (
            <>
              {isVisibleMenuButton && (
                <>
                  {isHomeScreen ? (
                    <>
                      <IconButton
                        onClick={() => {
                          navigate(isPatient ? "/patient" : "/therapist", {
                            replace: true,
                          });
                          setIsHomeScreen(false);
                        }}
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => {
                          navigate("/", {
                            replace: true,
                          });
                          setIsHomeScreen(true);
                        }}
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                      >
                        <MenuIcon />
                      </IconButton>
                    </>
                  )}
                </>
              )}
              {cancelNewTestButton && (
                <>
                  <IconButton
                    onClick={handleOpenModal}
                    size="large"
                    edge="start"
                    color="inherit"
                    sx={{ mr: 2 }}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </>
              )}
            </>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ textAlign: "center", flexGrow: 1 }}
          >
            3F
          </Typography>
          {userToken && (
            <div>
              {isVisibleProfileButton ? (
                <>
                  <IconButton size="large" onClick={handleMenu} color="inherit">
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    className="page__color"
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem
                      className="flex flex--column flex--align-center"
                      onClick={handleCloseMenu}
                    >
                      <h3>Můj profil</h3>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <h4>{`${profile.name} ${profile.surename}`}</h4>
                    </MenuItem>
                    <MenuItem sx={{ display: "block" }}>
                      <div>login:</div>
                      <h4>{profile.login}</h4>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      <ListItemIcon>
                        <KeyIcon fontSize="small" />
                      </ListItemIcon>
                      Změnit heslo
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        handleCloseMenu();
                      }}
                      // style={{ color: "red" }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Odhlásit se
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <IconButton
                    size="large"
                    onClick={toggleDrawer(!isOpenedDrawer)}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                </>
              )}
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          <h4>Opravdu zrušit vytváření testu?</h4>

          <div className="flex flex--justify-space-between page__form">
            <Button
              onClick={() => {
                handleCloseModal();
              }}
              sx={{ width: 100 }}
              variant="outlined"
              size="small"
              color="primary"
            >
              Ne
            </Button>
            <Button
              onClick={() => {
                isShortTest ? deleteShortTest() : deleteTest();
              }}
              sx={{ width: 100 }}
              variant="outlined"
              size="small"
              color="error"
            >
              Ano
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={open} onClose={handleClose}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          <form
            onSubmit={changePassword}
            className="flex flex--column flex--justify-center flex--align-center page__form"
          >
            <h4>Změnit heslo</h4>
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
        </Box>
      </Modal>
    </Box>
  );
};

export default MenuAppBar;

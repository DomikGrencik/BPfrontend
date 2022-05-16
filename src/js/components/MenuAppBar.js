import React, { useState, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const MenuAppBar = () => {
  const {
    initialize,
    getItem,
    setItem,
    isVisibleProfileButton,
    isOpenedDrawer,
    toggleDrawer,
    cancelNewTestButton,
    setCancelNewTestButton,
    testId,
  } = useAppContext();
  const userToken = getItem("userToken");
  const isPatient = getItem("isPatient");
  const isVisibleMenuButton = getItem("isVisibleMenuButton");

  const setIsHomeScreen = useCallback(
    (isHomeScreen) => setItem("isHomeScreen", isHomeScreen),
    [setItem]
  );
  const isHomeScreen = getItem("isHomeScreen");

  const [anchorEl, setAnchorEl] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      navigate("/patient", { replace: true });
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, setCancelNewTestButton, testId, userToken]);

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Profil</MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        handleClose();
                      }}
                      style={{ color: "red" }}
                    >
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
                deleteTest();
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
    </Box>
  );
};

export default MenuAppBar;

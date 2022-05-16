import React, { useState, useCallback, useEffect } from "react";
import { CircularProgress, List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Fab } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { InputAdornment } from "@mui/material";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const Home = () => {
  const { initialize, getItem, setItem } = useAppContext();
  const userToken = getItem("userToken");
  const isAdmin = getItem("isAdmin");
  const setUserId = (id) => setItem("userId", id);
  const setIsPatient = useCallback(
    (isPatient) => setItem("isPatient", isPatient),
    [setItem]
  );
  const isPatient = getItem("isPatient");
  const setIsVisibleMenuButton = useCallback(
    (isVisibleMenuButton) =>
      setItem("isVisibleMenuButton", isVisibleMenuButton),
    [setItem]
  );
  const setIsHomeScreen = useCallback(
    (isHomeScreen) => setItem("isHomeScreen", isHomeScreen),
    [setItem]
  );

  const [input, setInput] = useState("");
  const [id, setId] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const navigate = useNavigate();

  const onChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        const responseT = await apiFetch({
          route: "/users",
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          setLoading,
        });

        if (responseT) {
          if (Array.isArray(responseT)) {
            setTherapists(responseT);
          }
        } else {
          initialize();
          navigate("/", { replace: true });
        }
      }

      const responseP = await apiFetch({
        route: "/patients",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        setLoading,
      });

      if (responseP) {
        if (Array.isArray(responseP)) {
          setPatients(responseP);
        }
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
  }, [initialize, isAdmin, navigate, setIsPatient, userToken]);

  const deleteTherapist = useCallback(async () => {
    const response = await apiFetch({
      route: `/users/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      setTherapists(therapists.filter((therapist) => therapist.id !== id));
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [id, initialize, navigate, therapists, userToken]);

  const deletePatient = useCallback(async () => {
    const response = await apiFetch({
      route: `/patients/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      setPatients(patients.filter((patient) => patient.id_patient !== id));
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [id, initialize, navigate, patients, userToken]);

  return loading ? (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  ) : (
    <main className="page container--default flex--grow flex">
      <div className="page__form flex--grow flex flex--column flex--align-center">
        <TextField
          sx={{ width: 210 }}
          label="Hledat"
          variant="outlined"
          type="search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={onChange}
        />
        <div className="page__width ">
          {/* Therapists */}
          {isAdmin && (
            <>
              <h2>Logopedi</h2>
              <List>
                {therapists.map((therapist, index) => {
                  const matches =
                    `${therapist.name.toLowerCase()}${therapist.surename.toLowerCase()}`.includes(
                      input.toLowerCase().replace(/\s/g, "")
                    );

                  return (
                    matches && (
                      <ListItem
                        key={index}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            onClick={() => {
                              handleOpenModal();
                              setId(therapist.id);
                              setIsPatient(false);
                            }}
                            edge="end"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemButton
                          onClick={() => {
                            navigate("/therapist", { replace: true });
                            setUserId(therapist.id);
                            setIsPatient(false);
                            setIsVisibleMenuButton(true);
                            setIsHomeScreen(false);
                          }}
                        >
                          <ListItemText
                            primary={
                              therapist.id +
                              ", " +
                              therapist.name +
                              " " +
                              therapist.surename
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    )
                  );
                })}
              </List>
            </>
          )}

          {/* Patients */}
          <h2 className="home__margin">Pacienti</h2>
          <List>
            {patients.map((patient, index) => {
              const matches =
                `${patient.name.toLowerCase()}${patient.surename.toLowerCase()}`.includes(
                  input.toLowerCase().replace(/\s/g, "")
                );
              return (
                matches && (
                  <ListItem
                    key={index}
                    disablePadding
                    secondaryAction={
                      <IconButton
                        onClick={() => {
                          handleOpenModal();
                          setId(patient.id_patient);
                          setIsPatient(true);
                        }}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => {
                        navigate("/patient", { replace: true });
                        setUserId(patient.id_patient);
                        setIsPatient(true);
                        setIsVisibleMenuButton(true);
                        setIsHomeScreen(false);
                      }}
                    >
                      <ListItemText
                        primary={patient.id_patient + ", " + patient.initials}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              );
            })}
          </List>
        </div>
      </div>

      {isAdmin && (
        <>
          <Fab
            onClick={() => {
              navigate("/addtherapist", { replace: true });
            }}
            sx={{ position: "fixed", bottom: 20, left: 20 }}
            color="primary"
            variant="extended"
          >
            <AddIcon sx={{ mr: 1 }} />
            logoped
          </Fab>
        </>
      )}
      <Fab
        onClick={() => {
          navigate("/addpatient", { replace: true });
        }}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        color="primary"
        variant="extended"
      >
        <AddIcon sx={{ mr: 1 }} />
        pacient
      </Fab>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          {isPatient ? (
            <h4>Pacient bude smazán</h4>
          ) : (
            <h4>Logoped bude smazán</h4>
          )}
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
              Zrušit
            </Button>
            <Button
              onClick={() => {
                isPatient ? deletePatient() : deleteTherapist();
                handleCloseModal();
              }}
              sx={{ width: 100 }}
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Smazat
            </Button>
          </div>
        </Box>
      </Modal>
    </main>
  );
};

export default Home;

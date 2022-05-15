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
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment } from "@mui/material";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const Home = () => {
  const { getItem, setItem } = useAppContext();
  const userToken = getItem("userToken");
  const setUserId = (id) => setItem("userId", id);

  const [input, setInput] = useState("");
  const [id, setId] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [therapistTF, setTherapistTF] = useState(true);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const navigate = useNavigate();

  const onChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);
  };

  const navTherapist = useCallback(() => {
    navigate("/therapist", { replace: true });
  }, [navigate]);

  const navPatient = useCallback(() => {
    navigate("/patient", { replace: true });
  }, [navigate]);

  const navAddTherapist = useCallback(() => {
    navigate("/addtherapist", { replace: true });
  }, [navigate]);

  const navAddPatient = useCallback(() => {
    navigate("/addpatient", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
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
        setItem(["userToken", "userId"], "");
        navigate("/", { replace: true });
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
        setItem(["userToken", "userId"], "");
        navigate("/", { replace: true });
      }
    };
    fetchData();
  }, [navigate, setItem, userToken]);

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
      setItem("userToken", "");
      setItem("userId", "");
      navigate("/", { replace: true });
    }
  }, [id, navigate, setItem, therapists, userToken]);

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
      setItem("userToken", "");
      setItem("userId", "");
      navigate("/", { replace: true });
    }
  }, [id, navigate, patients, setItem, userToken]);

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
                          setTherapistTF(true);
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
                        navTherapist();
                        setUserId(therapist.id);
                        setTherapistTF(true);
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
                          setTherapistTF(false);
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
                        navPatient();
                        setUserId(patient.id_patient);
                        setTherapistTF(false);
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

          <div className="page__width home__sticky home__margin flex flex--justify-space-between">
            <Button
              onClick={navAddTherapist}
              sx={{ width: 100, height: 56 }}
              variant="contained"
              color="success"
            >
              Přidat logopeda
            </Button>
            <Button
              onClick={navAddPatient}
              sx={{ width: 100, height: 56 }}
              variant="contained"
            >
              Přidat pacienta
            </Button>
          </div>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          {therapistTF ? (
            <h4>Logoped bude smazán</h4>
          ) : (
            <h4>Pacient bude smazán</h4>
          )}

          <Button
            onClick={() => {
              therapistTF ? deleteTherapist() : deletePatient();
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
        </Box>
      </Modal>
    </main>
  );
};

export default Home;

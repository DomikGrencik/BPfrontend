import React, { useState, useCallback, useEffect } from "react";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment } from "@mui/material";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const Home = () => {
  const { userToken } = useAppContext();
  console.log(userToken);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [id, setId] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [therapistTF, setTherapistTF] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      });
      const responseP = await apiFetch({
        route: "/patients",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(responseT);
      console.log(responseP);
      if (Array.isArray(responseT.data)) {
        setTherapists(responseT.data);
      }
      if (Array.isArray(responseP.data)) {
        setPatients(responseP.data);
      }
    };
    fetchData();
  }, [userToken]);

  const deleteTherapist = useCallback(async () => {
    await apiFetch({
      route: `/users/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  }, [id, userToken]);

  const deletePatient = useCallback(async () => {
    await apiFetch({
      route: `/patients/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  }, [id, userToken]);

  return (
    <main className="page container--default flex--grow flex">
      <form className="page__form flex--grow flex flex--column flex--align-center">
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
                          handleOpen();
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
                    <ListItemButton onClick={navTherapist}>
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
                          handleOpen();
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
                    <ListItemButton onClick={navPatient}>
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
      </form>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="flex flex--column flex--justify-center flex--align-center home__modal">
          {therapistTF ? (
            <h4>Logoped bude smazán</h4>
          ) : (
            <h4>Pacient bude smazán</h4>
          )}

          <Button
            onClick={() => {
              therapistTF ? deleteTherapist() : deletePatient();
              handleClose();
            }}
            sx={{ width: 100, marginTop: 1 }}
            variant="contained"
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

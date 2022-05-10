import React, { useState, useCallback, useEffect } from "react";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment } from "@mui/material";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const Home = () => {
  const { userToken } = useAppContext();
  const navigate = useNavigate();
  console.log(userToken);

  const [input, setInput] = useState("");

  const onChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);
  };

  const navTherapist = useCallback(
    async (event) => {
      event.preventDefault();
      navigate("/addtherapist", { replace: true });
    },
    [navigate]
  );

  const navPatient = useCallback(
    async (event) => {
      event.preventDefault();
      navigate("/addpatient", { replace: true });
    },
    [navigate]
  );

  const [therapists, setTherapists] = useState([
    {
      id: 2,
      login: "xploch2",
      name: "Jano",
      surename: "Plochta",
      role: ["user"],
      created_at: "20 Mar 2022, 22:14",
      updated_at: "20 Mar 2022, 22:14",
    },
    {
      id: 3,
      login: "xvacha3",
      name: "Kalap",
      surename: "Vachata",
      role: ["user"],
      created_at: "20 Mar 2022, 22:15",
      updated_at: "20 Mar 2022, 22:15",
    },
  ]);

  const [patients, setPatients] = useState([
    {
      id_patient: 2,
      name: "Maco",
      surename: "Mamuko",
      initials: "MM",
      birth_year: 2000,
      gender: "M",
      id: 3,
      created_at: "20 Mar 2022, 22:15",
      updated_at: "20 Mar 2022, 22:15",
    },
    {
      id_patient: 3,
      name: "Jano",
      surename: "Kalap",
      initials: "JK",
      birth_year: 2000,
      gender: "M",
      id: 3,
      created_at: "20 Mar 2022, 22:15",
      updated_at: "20 Mar 2022, 22:15",
    },
  ]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const responseT = await apiFetch({
  //       route: "/users",
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     });
  //     const responseP = await apiFetch({
  //       route: "/patients",
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     });
  //     setTherapists(responseT);
  //     setPatients(responseP);
  //   };
  //   fetchData();
  // }, [userToken]);

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
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton>
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
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton>
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
              onClick={navTherapist}
              sx={{ width: 100, height: 56 }}
              variant="contained"
              color="success"
            >
              Přidat logopeda
            </Button>
            <Button
              onClick={navPatient}
              sx={{ width: 100, height: 56 }}
              variant="contained"
            >
              Přidat pacienta
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Home;

import React, { useState, useCallback, useEffect } from "react";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const AddPatient = () => {
  const { initialize, getItem } = useAppContext();
  const userToken = getItem("userToken");
  const isAdmin = getItem("isAdmin");

  const [therapists, setTherapists] = useState([]);
  const [patientData, setPatientData] = useState({
    name: "",
    surename: "",
    birth_year: null,
    gender: "",
    id: "",
  });

  const navigate = useNavigate();

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();

      const data = {
        ...patientData,
        birth_year: new Date(patientData.birth_year).getFullYear(),
      };

      const response = await apiFetch({
        route: "/patients",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      });

      if (response) {
        navigate("/home", { replace: true });
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, patientData, userToken]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: "/users",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        if (Array.isArray(response)) {
          setTherapists(response);
        }
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    };

    if (userToken) {
      if (isAdmin) {
        fetchData();
      }
    } else {
      navigate("/", { replace: true });
    }
  }, [initialize, isAdmin, navigate, userToken]);

  return (
    <main className="page container--default flex--grow flex">
      <form
        onSubmit={submitForm}
        className="page__form flex--grow flex flex--column flex--justify-center flex--align-center"
      >
        <h2>Přidání pacienta</h2>
        <TextField
          onChange={(event) =>
            setPatientData({ ...patientData, name: event.target.value })
          }
          required
          label="Jméno"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          onChange={(event) =>
            setPatientData({ ...patientData, surename: event.target.value })
          }
          required
          label="Příjmení"
          variant="outlined"
          autoComplete="off"
        />
        <div className="page__width">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year"]}
              label="Rok narození"
              value={patientData.birth_year}
              maxDate={new Date()}
              onChange={(newValue) => {
                setPatientData({
                  ...patientData,
                  birth_year: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} required />
              )}
            />
          </LocalizationProvider>
        </div>
        <FormControl required className="page__width">
          <InputLabel>Pohlaví</InputLabel>
          <Select
            value={patientData.gender}
            label="Pohlaví"
            onChange={(event) =>
              setPatientData({ ...patientData, gender: event.target.value })
            }
          >
            <MenuItem value={"M"}>Mužské</MenuItem>
            <MenuItem value={"F"}>Ženské</MenuItem>
          </Select>
        </FormControl>

        {isAdmin && (
          <>
            <Autocomplete
              disablePortal
              options={therapists.map((option) => {
                return {
                  value: option.id,
                  label: `${option.name} ${option.surename}`,
                };
              })}
              sx={{ width: 210 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Přidání logopedovi"
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
              onChange={(_, value) => {
                setPatientData({ ...patientData, id: value.value });
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          </>
        )}
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

export default AddPatient;

import React, { useState, useCallback} from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { HTTP_CREATED } from "../utils/variables";

const AddPatient = () => {
  const { userToken } = useAppContext();
  const [patientData, setPatientData] = useState({
    name: "",
    surename: "",
    birth_year: null,
    gender: "",
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
          Authorization: "Bearer " + userToken,
        },
        body: data,
      });
      if (response.status === HTTP_CREATED) {
        navigate("/", { replace: true });
      }
    },
    [navigate, patientData, userToken]
  );

  const cancelAction = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  console.log(patientData);
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
        />
        <TextField
          onChange={(event) =>
            setPatientData({ ...patientData, surename: event.target.value })
          }
          required
          label="Příjmení"
          variant="outlined"
        />
        {/* <TextField
          onChange={(event) =>
            setPatientData({ ...patientData, birth_year: event.target.value })
          }
          required
          label="Rok narození"
          variant="outlined"
        /> */}
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
            <MenuItem value={"Z"}>Ženské</MenuItem>
          </Select>
        </FormControl>
        <div className="page__width flex flex--justify-space-evenly">
          <Button
            onClick={cancelAction}
            sx={{ width: 100, height: 56 }}
            variant="contained"
            color="error"
          >
            Zrušit
          </Button>
          <Button
            type="submit"
            sx={{ width: 100, height: 56 }}
            variant="contained"
          >
            Přidat
          </Button>
        </div>
      </form>
    </main>
  );
};

export default AddPatient;

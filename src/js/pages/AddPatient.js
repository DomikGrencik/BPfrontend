import React, { useRef, useState, useCallback } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Autocomplete } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const AddPatient = () => {
  const { userToken } = useAppContext();
  const PatientData = useRef({
    name: "",
    surename: "",
    birth_year: "",
    gender: "",
  });
  const navigate = useNavigate();
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  //   const [value, setValue] = React.useState(new Date());
  console.log(userToken);

  const gender = ["mužské", "ženské"];

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();
      console.log(userToken);
      const response = await apiFetch({
        route: "/patients",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: PatientData.current,
      });
      if (response.status === 201) {
        setFormError(false);
        setFormErrorMsg("");
        navigate("/", { replace: true });
      } else {
        setFormError(true);
        setFormErrorMsg(response.data?.message);
      }
    },
    [navigate, userToken]
  );

  const cancelAction = useCallback(
    async (event) => {
      event.preventDefault();
      navigate("/", { replace: true });
    },
    [navigate]
  );

  return (
    <main className="page container--default flex--grow flex">
      <form
        onSubmit={submitForm}
        className="page__form flex--grow flex flex--column flex--justify-center flex--align-center"
      >
        <h2>Přidání pacienta</h2>
        <TextField label="Jméno" variant="outlined" />
        <TextField label="Příjmení" variant="outlined" />
        <TextField label="Rok narození" variant="outlined" />
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={["year"]}
            label="Year only"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </LocalizationProvider> */}
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={gender}
          sx={{ width: 210 }}
          renderInput={(params) => <TextField {...params} label="Pohlaví" />}
        />
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

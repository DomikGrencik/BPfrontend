import React, { useEffect, useState, useCallback } from "react";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import _ from "lodash";
import { HTTP_OK } from "../utils/variables";

const Therapist = () => {
  const { userToken } = useAppContext();
  const { userId } = useAppContext();
  const [therapist, setTherapist] = useState({});
  const [isChangeName, setIsChangeName] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  console.log(userToken, userId);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: `/users/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(response.data);
      setTherapist(response.data);
    };
    fetchData();
  }, [userId, userToken]);

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
        body: { name: therapist.name, surename: therapist.surename },
      });
      if (response.status !== HTTP_OK) {
        console.log("chyba");
      }
    },
    [therapist.name, therapist.surename, userId, userToken]
  );

  return _.isEmpty(therapist) ? (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  ) : (
    <main className="page page__form container--default flex--grow flex flex--column flex--justify-center flex--align-center">
      <h2>Profil logopeda</h2>
      <div className="page__width ">
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
        <Button
          onClick={() => {
            handleOpen();
            setIsChangeName(false);
          }}
          sx={{ width: 210, height: 56, marginTop: 1 }}
          variant="outlined"
          startIcon={<KeyIcon />}
        >
          Změnit heslo
        </Button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box className="flex flex--column flex--justify-center flex--align-center therapist__modal page__form">
          <form
            onSubmit={(event) => {
              changeName(event);
              handleClose();
            }}
            className="flex flex--column flex--justify-center flex--align-center page__form"
          >
            {isChangeName ? (
              <>
                <h4>Změnit jméno a příjmení</h4>
                <TextField
                  onChange={(event) =>
                    setTherapist({ ...therapist, name: event.target.value })
                  }
                  label="Jméno"
                  variant="outlined"
                  defaultValue={therapist.name}
                />
                <TextField
                  onChange={(event) =>
                    setTherapist({ ...therapist, surename: event.target.value })
                  }
                  label="Příjmení"
                  variant="outlined"
                  defaultValue={therapist.surename}
                />
              </>
            ) : (
              <>
                <h4>Změnit heslo</h4>
                <FormControl className="page__width">
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </>
            )}

            <Button
              type="submit"
              sx={{ width: 100 }}
              variant="contained"
              size="small"
            >
              Změnit
            </Button>
          </form>
        </Box>
      </Modal>
    </main>
  );
};

export default Therapist;

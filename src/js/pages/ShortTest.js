import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Fab } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Accordion } from "@mui/material";
import { AccordionSummary } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import { Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemText } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DoneIcon from "@mui/icons-material/Done";
import { apiFetch } from "../utils/apiFetch";

const ShortTest = () => {
  const {
    initialize,
    getItem,
    setItem,
    testId,
    setIsVisibleProfileButton,
    isOpenedDrawer,
    toggleDrawer,
    setCancelNewTestButton,
  } = useAppContext();
  const userToken = getItem("userToken");

  const setIsVisibleMenuButton = useCallback(
    (isVisibleMenuButton) =>
      setItem("isVisibleMenuButton", isVisibleMenuButton),
    [setItem]
  );

  const [tasks, setTasks] = useState([]);
  const [idTask, setIdTask] = useState(0);

  const [showBackButton, setShowBackButton] = useState(true);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(true);

  const [loading, setLoading] = useState(true);

  const [taskPoints, setTaskPoints] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const navigate = useNavigate();

  // Gets all short test's tasks
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: "/tasks/getShortTestTask",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        setLoading,
      });

      if (response) {
        if (Array.isArray(response)) {
          setTasks(response);
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
  }, [initialize, navigate, userToken]);

  // Gets one short test's task with points value
  useEffect(() => {
    setShowBackButton(idTask > 0);
    setShowNextButton(idTask < 8);
    setShowSaveButton(idTask >= 8);

    const fetchData = async () => {
      const response = await apiFetch({
        route: `/short_test_tasks/getShortTestTaskPoints`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          id_short_test: `${testId}`,
          id_task: `${idTask + 46}`,
        },
        setLoading,
      });

      if (response) {
        if (response.points === "-1") {
          setShouldUpdate(false);
        } else {
          setTaskPoints(response.points);
          setShouldUpdate(true);
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
  }, [idTask, initialize, navigate, testId, userToken]);

  //Adds or updates points value of one task of short test
  const handleChange = useCallback(
    async (event) => {
      const points = event.target.value;

      const response = await apiFetch({
        route: "/short_test_tasks",
        method: shouldUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          id_short_test: `${testId}`,
          id_task: `${idTask + 46}`,
          points: `${points}`,
        },
      });

      if (response) {
        setShouldUpdate(true);
        setTaskPoints(points);
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [idTask, initialize, navigate, shouldUpdate, testId, userToken]
  );

  return loading ? (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  ) : (
    // <main className="page container--default flex--grow flex">
    //   <h3>Som short test</h3>
    // </main>
    tasks.length && (
      <main className="page container--default flex--grow flex">
        <div className="page__form flex--grow flex flex--column flex--align-center">
          <h2>{`${tasks[idTask].id_task} ${tasks[idTask].category}`}</h2>
          <div className="page__width2">
            <h3>{tasks[idTask].subcategory}</h3>
            <h3 style={{ marginTop: 5 }}>{tasks[idTask].title}</h3>
            <Accordion sx={{ marginTop: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Popis úkolu</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{tasks[idTask].description}</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Kriteria Hodnocení</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{tasks[idTask].evaluation}</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <FormControl className="page__width">
            <InputLabel>Body</InputLabel>
            <Select value={taskPoints} label="Body" onChange={handleChange}>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="8">8</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="0">0</MenuItem>
            </Select>
          </FormControl>

          <SwipeableDrawer
            anchor={"right"}
            open={isOpenedDrawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{
                width: 250,
              }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {tasks.map((task, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setIdTask(task.id_task - 46);
                        setTaskPoints("");
                      }}
                    >
                      <ListItemText primary={task.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </SwipeableDrawer>
        </div>

        {showBackButton && (
          <Fab
            onClick={() => {
              setIdTask(idTask - 1);
              setTaskPoints("");
            }}
            sx={{ position: "fixed", bottom: 20, left: 20 }}
            color="primary"
            variant="extended"
          >
            <ArrowBackIosNewIcon sx={{ mr: 1 }} />
            Zpět
          </Fab>
        )}
        {showNextButton && (
          <Fab
            onClick={() => {
              setIdTask(idTask + 1);
              setTaskPoints("");
            }}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
            color="primary"
            variant="extended"
          >
            Dále
            <ArrowForwardIosIcon sx={{ ml: 1 }} />
          </Fab>
        )}
        {showSaveButton && (
          <Fab
            onClick={() => {
              navigate("/patient", { replace: true });
              setIsVisibleMenuButton(true);
              setIsVisibleProfileButton(true);
              setCancelNewTestButton(false);
            }}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
            color="success"
            variant="extended"
          >
            Uložit
            <DoneIcon sx={{ ml: 1 }} />
          </Fab>
        )}
      </main>
    )
  );
};

export default ShortTest;

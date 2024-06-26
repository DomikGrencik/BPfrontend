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
import { FormControlLabel } from "@mui/material";
import { RadioGroup } from "@mui/material";
import { Radio } from "@mui/material";
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

const Test = () => {
  const {
    initialize,
    getItem,
    testId,
    isOpenedDrawer,
    toggleDrawer,
  } = useAppContext();
  const userToken = getItem("userToken");

  const [tasks, setTasks] = useState([]);
  const [idTask, setIdTask] = useState(0);

  const [showBackButton, setShowBackButton] = useState(true);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(true);

  const [loading, setLoading] = useState(true);

  const [taskPoints, setTaskPoints] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const navigate = useNavigate();

  // Gets all test's tasks
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: "/tasks/getTestTask",
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

  // Gets one test's task with points value
  useEffect(() => {
    setShowBackButton(idTask > 0);
    setShowNextButton(idTask < 44);
    setShowSaveButton(idTask >= 44);

    const fetchData = async () => {
      const response = await apiFetch({
        route: `/test_tasks/getTestTaskPoints`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          id_test: `${testId}`,
          id_task: `${idTask + 1}`,
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

  //Adds or updates points value of one task of test
  const handleChange = useCallback(
    async (event) => {
      const points = event.target.value;

      const response = await apiFetch({
        route: "/test_tasks",
        method: shouldUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          id_test: `${testId}`,
          id_task: `${idTask + 1}`,
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
    tasks.length && (
      <main className="page container--default flex--grow flex">
        <div className="page__form flex--grow flex flex--column flex--align-center">
          <h2>{`${tasks[idTask].category}`}</h2>
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

          <FormControl>
            <RadioGroup value={taskPoints} onChange={handleChange}>
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="1" control={<Radio />} label="1" />
              <FormControlLabel value="0" control={<Radio />} label="0" />
            </RadioGroup>
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
                        setIdTask(task.id_task - 1);
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

export default Test;

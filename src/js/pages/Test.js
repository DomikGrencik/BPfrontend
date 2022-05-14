import React, { useEffect, useState } from "react";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Fab } from "@mui/material";
import { CircularProgress } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { apiFetch } from "../utils/apiFetch";

const Test = () => {
  const { getItem, setItem } = useAppContext();
  const userToken = getItem("userToken");

  const [tasks, setTasks] = useState([]);
  const [idTask, setIdTask] = useState(0);
  const [showBackButton, setShowBackButton] = useState(true);
  const [showNextButton, setShowNextButton] = useState(true);
  const [loading, setLoading] = useState(true);

  const { navigate } = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: "/tasks/getTestTasks",
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
        setItem("userToken", "");
        setItem("userId", "");
        navigate("/", { replace: true });
      }
    };
    fetchData();
  }, [navigate, setItem, userToken]);

  useEffect(() => {
    idTask === 0 ? setShowBackButton(false) : setShowBackButton(true);
    idTask === 44 ? setShowNextButton(false) : setShowNextButton(true);
  }, [idTask]);

  return loading ? (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  ) : (
    tasks.length && (
      <main className="page container--default flex--grow flex">
        <div className="page__form flex--grow flex flex--column flex--align-center">
          <h2>Test</h2>
          <h3>{`${tasks[idTask].id_task} ${tasks[idTask].category}`}</h3>
        </div>
        {showNextButton && (
          <Fab
            onClick={() => {
              console.log("next");
              setIdTask(idTask + 1);
            }}
            sx={{ position: "fixed", bottom: 20, right: 20 }}
            color="primary"
            variant="extended"
          >
            Dále
            <ArrowForwardIosIcon sx={{ ml: 1 }} />
          </Fab>
        )}
        {showBackButton && (
          <Fab
            onClick={() => {
              console.log("back");
              setIdTask(idTask - 1);
            }}
            sx={{ position: "fixed", bottom: 20, left: 20 }}
            color="primary"
            variant="extended"
          >
            <ArrowBackIosNewIcon sx={{ mr: 1 }} />
            Zpět
          </Fab>
        )}
      </main>
    )
  );
};

export default Test;

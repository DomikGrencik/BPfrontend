import React, { useEffect } from "react";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Splash = () => {
  const { userToken } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    userToken
      ? navigate("/", { replace: true })
      : navigate("/login", { replace: true });
  }, [navigate, userToken]);

  return (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  );
};

export default Splash;

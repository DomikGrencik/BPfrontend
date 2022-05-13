import React, { useEffect } from "react";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const { userToken } = useAppContext();
  const { testId } = useAppContext();

  return (
    <main className="page container--default flex--grow flex">
      <div className="page__form flex--grow flex flex--column flex--align-center">
        <h2>Test</h2>
      </div>
    </main>
  );
};

export default Test;

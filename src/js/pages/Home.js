import React from "react";
import { useAppContext } from "../../App";

const Home = () => {
  const { userToken } = useAppContext();
  console.log(userToken);

  return (
    <main className="container--default" style={{ height: 1000 }}>
      Home
    </main>
  );
};

export default Home;

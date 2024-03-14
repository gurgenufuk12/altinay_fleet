import React from "react";
import Map from "./Map.tsx";

const Home = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <Map width={600} height={600} />
    </div>
  );
};

export default Home;

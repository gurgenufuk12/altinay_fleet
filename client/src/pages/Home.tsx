import React from "react";
import Canvas from "./Canvas.tsx";

const Home = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <Canvas width={600} height={600} />
    </div>
  );
};

export default Home;

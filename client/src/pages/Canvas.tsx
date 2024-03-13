import React from "react";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";

interface Robot {
  Pose: {
    Position: {
      x: string;
      y: string;
      z: string;
    };
    Orientation: {
      x: string;
      y: string;
      z: string;
      w: string;
    };
  };
  robotCharge: string;
  robotStatus: string;
  robotVelocity: {
    lineerVelocity: string;
    angularVelocity: string;
  };
  Target: {
    Position: {
      x: string;
      y: string;
      z: string;
    };
    Orientation: {
      x: string;
      y: string;
      z: string;
      w: string;
    };
    targetExecuted: boolean;
  };
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
  };
  robotName: string;
}

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [robots, setRobots] = React.useState<Robot[]>([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRobots();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchRobots = async () => {
    try {
      const res = await axios.get("/robots/getRobots");
      setRobots(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        robots.forEach((robot) => {
          var temp_X = parseFloat(robot.Pose.Position.x);
          var temp_Y = parseFloat(robot.Pose.Position.y);
          var x = temp_Y * -1;
          var y = temp_X;
          x = ((-1 * x + 13) / 26) * width;
          y = ((-1 * y + 13) / 26) * height;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
          ctx.stroke();
          ctx.fillText(robot.robotName, x - 10, y - 20);
          ctx.textAlign = "start";
        });
      }
    }
  }, [robots, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-black"
    />
  );
};

export default Canvas;

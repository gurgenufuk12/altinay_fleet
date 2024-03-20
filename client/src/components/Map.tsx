import React from "react";
import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";
import RobotInfo from "./RobotInfo";
import Robot from "../assets/amr.png";
import CanvasMap from "../assets/map.jpg";
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
    linearVelocity: string;
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
interface Task {
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
}
interface User {
  id: string;
  username: string;
}
interface CanvasProps {
  width: number;
  height: number;
}

const Map: React.FC<CanvasProps> = ({ width, height }) => {
  const [token, setToken] = React.useState<string | null>("");
  const [user, setUser] = React.useState<User | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [robots, setRobots] = React.useState<Robot[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [selectedRobot, setSelectedRobot] = React.useState<Robot | null>(null);
  const [taskName, setTaskName] = React.useState<string>("");
  const [arrowStart, setArrowStart] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [arrowEnd, setArrowEnd] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [targetPosition, setTargetPosition] = React.useState<{
    x: number;
    y: number;
    z: 0;
  } | null>(null);
  const [targetOrientation, setTargetOrientation] = React.useState<{
    x: number;
    y: number;
    z: number;
    w: number;
  } | null>(null);

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

  const convertCoordinates = (x: number, y: number) => {
    const canvasX = ((x / +1 + 13) / 26) * width;
    const canvasY = ((y / -1 + 13) / 26) * height;

    return { x: canvasX, y: canvasY };
  };
  const reverseCoordinates = (x: number, y: number) => {
    const temp_X = (x / width) * 26 - 13;
    const temp_Y = (y / height) * 26 - 13;
    const X = temp_Y * -1;
    const Y = temp_X;
    return { x: X, y: Y };
  };

  const handleCanvasMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setArrowStart({ x: x, y: y });
      setArrowEnd({ x: x, y: y }); // Start and end are the same initially
    }
  };
  React.useEffect(() => {
    const token = localStorage.getItem("userData");
    if (token) {
      setToken(token);
    }
  }, []);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/getUserByToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [token]);

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (arrowStart) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setArrowEnd({ x: x, y: y });
      }
    }
  };
  const calculateAngle = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ): number => {
    const deltaY = point2.y - point1.y;
    const deltaX = point2.x - point1.x;
    return (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  };
  const calculateOrientation = (
    angle: number
  ): { x: number; y: number; z: number; w: number } => {
    const halfAngle = angle / 2;
    const sinHalfAngle = Math.sin((halfAngle * Math.PI) / 180);
    const cosHalfAngle = Math.cos((halfAngle * Math.PI) / 180);

    const x = 0;
    const y = 0;
    const z = sinHalfAngle;
    const w = cosHalfAngle;

    return { x, y, z, w };
  };
  const calculateRotationAngle = (orientation: {
    x: string;
    y: string;
    z: string;
    w: string;
  }): number => {
    const { x, y, z, w } = orientation;

    const qx = parseFloat(x);
    const qy = parseFloat(y);
    const qz = parseFloat(z);
    const qw = parseFloat(w);

    const sinYaw = 2 * (qx * qy + qz * qw);
    const cosYaw = 1 - 2 * (qx * qx + qz * qz);
    let yaw = Math.PI - Math.atan2(sinYaw, cosYaw);

    const yawDegrees = 180 + (yaw * 180) / Math.PI;

    return yawDegrees;
  };
  const drawRobotArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    const arrowLength = 20; // Length of the arrow
    const arrowWidth = 30; // Width of the arrow
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + arrowLength * Math.cos((angle - 90) * (Math.PI / 180)),
      y + arrowLength * Math.sin((angle - 90) * (Math.PI / 180))
    );
    ctx.lineTo(
      x + arrowWidth * Math.cos(angle * (Math.PI / 180)),
      y + arrowWidth * Math.sin(angle * (Math.PI / 180))
    );
    ctx.lineTo(
      x + arrowLength * Math.cos((angle + 90) * (Math.PI / 180)),
      y + arrowLength * Math.sin((angle + 90) * (Math.PI / 180))
    );
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
  };
  const handleCanvasMouseUp = async () => {
    if (arrowStart && arrowEnd) {
      const { x: robotXStart, y: robotYStart } = reverseCoordinates(
        arrowStart.x,
        arrowStart.y
      );
      const { x: robotXEnd, y: robotYEnd } = reverseCoordinates(
        arrowEnd.x,
        arrowEnd.y
      );

      setTargetPosition({
        x: robotXStart,
        y: robotYStart,
        z: 0,
      });

      const angle = calculateAngle(arrowStart, arrowEnd);

      const taskOrientation = calculateOrientation(angle);

      setTargetOrientation({
        x: taskOrientation.x,
        y: taskOrientation.y,
        z: taskOrientation.z,
        w: taskOrientation.w,
      });
      setTasks([
        ...tasks,
        {
          Target: {
            Position: {
              x: robotXStart.toString(),
              y: robotYStart.toString(),
              z: "0",
            },
            Orientation: {
              x: taskOrientation.x.toString(),
              y: taskOrientation.y.toString(),
              z: taskOrientation.z.toString(),
              w: taskOrientation.w.toString(),
            },
            targetExecuted: false,
          },
        },
      ]);
    }

    setArrowStart(null);
    setArrowEnd(null);
  };
  const showTasks = () => {
    console.log(tasks);
  };
  const giveTaskToRobot = async () => {
    switch (true) {
      case selectedRobot === null && tasks.length === 0:
        toast.error("Please select a robot and target position");
        break;
      case selectedRobot !== null && tasks.length === 0:
        toast.error("Please give a task to the robot");
        break;
      case selectedRobot === null && tasks.length !== 0:
        toast.error("Please select a robot to give a task");
        break;
      default:
        if (targetPosition && targetOrientation) {
          try {
            const res = await axios.post("/robots/addTarget", {
              taskName: taskName,
              taskCode: "1",
              taskPriority: "1",
              taskPercentage: "0",
              robotName: selectedRobot?.robotName,
              linearVelocity: "0",
              angularVelocity: "0",
              targets: tasks.map((task, index) => ({
                targetPosition: task.Target.Position,
                targetOrientation: task.Target.Orientation,
                targetExecuted: false,
              })),
            });
            toast.success("Task is given to robot successfully");

            const res2 = await axios.post("/tasks/addTasks", {
              userName: user?.username,
              taskName: taskName,
              taskCode: "1",
              taskPriority: "1",
              taskPercentage: "0",
              robotName: selectedRobot?.robotName,
              targets: tasks.map((task, index) => ({
                targetPosition: task.Target.Position,
                targetOrientation: task.Target.Orientation,
                targetExecuted: false,
              })),
              taskStartTime: new Date().toISOString(),
            });
          } catch (error: any) {
            toast.error(error.response.data.message);
          }
        }
        setTasks([]);
        break;
    }
  };
  const clearTaskList = () => {
    setTasks([]);
    toast.success("Task list is cleared");
  };
  const handleDeleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    toast.success("Task deleted successfully!");
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        robots.forEach((robot) => {
          const { x, y } = convertCoordinates(
            parseFloat(robot.Pose.Position.x),
            parseFloat(robot.Pose.Position.y)
          );

          const orientationAngle = calculateRotationAngle(
            robot.Pose.Orientation
          );
          drawRobotArrow(ctx, x, y, orientationAngle);
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
          ctx.stroke();
          ctx.fillText(robot.robotName, x - 10, y - 30);
          ctx.fillText(
            `Velocity ${robot.robotVelocity.linearVelocity}m/s`,
            x - 30,
            y + 20
          );
          ctx.textAlign = "start";
        });
        if (arrowStart && arrowEnd) {
          const angle = Math.atan2(
            arrowEnd.y - arrowStart.y,
            arrowEnd.x - arrowStart.x
          );
          ctx.beginPath();
          ctx.moveTo(arrowStart.x, arrowStart.y);
          ctx.lineTo(arrowEnd.x, arrowEnd.y);
          ctx.lineTo(
            arrowEnd.x - 10 * Math.cos(angle - Math.PI / 6),
            arrowEnd.y - 10 * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(arrowEnd.x, arrowEnd.y);
          ctx.lineTo(
            arrowEnd.x - 10 * Math.cos(angle + Math.PI / 6),
            arrowEnd.y - 10 * Math.sin(angle + Math.PI / 6)
          );

          ctx.strokeStyle = "green";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  }, [robots, width, height, arrowStart, arrowEnd]);
  const handleRobotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const robotName = event.target.value;
    const selectedRobot = robots.find((robot) => robot.robotName === robotName);
    setSelectedRobot(selectedRobot || null);
    toast.success("Robot selected successfully: " + robotName);
  };
  const handleTaskName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskName(event.target.value);
    toast.success("Task selected successfully: " + event.target.value);
  };

  return (
    <div className="flex flex-row ml-96 justify-center mt-11">
      <div className="mr-10">
        <RobotInfo selectedRobot={selectedRobot} />
      </div>
      <div>
        <select
          onChange={handleRobotChange}
          value={selectedRobot ? selectedRobot.robotName : ""}
        >
          <option value="">Select a robot</option>
          {robots.map((robot) => (
            <option key={robot.robotName} value={robot.robotName}>
              {robot.robotName}
            </option>
          ))}
        </select>
        <select onChange={handleTaskName} value={taskName}>
          <option value="">Select Task Name</option>
          <option value="Patrol">Patrol</option>
          <option value="Docking">Docking</option>
          <option value="Lift">Lift</option>
        </select>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-2 border-black"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          style={{
            backgroundImage: `url(${CanvasMap})`,
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 h-14"
          onClick={giveTaskToRobot}
        >
          Give Task
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 h-14"
          onClick={clearTaskList}
        >
          Clear Task List
        </button>
      </div>
      <div className="flex flex-col gap-3 pl-5 mt-6">
        Task List:
        {tasks.map((task, index) => (
          <div key={index}>
            <h1>Target Position</h1>
            <p>X: {task.Target.Position.x}</p>
            <p>Y: {task.Target.Position.y}</p>

            <h1>Target Orientation</h1>
            <p>Z: {task.Target.Orientation.z}</p>
            <p>W: {task.Target.Orientation.w}</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteTask(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;

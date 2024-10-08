import React, { useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import RobotInfo from "./RobotInfo";
import { useUserContext } from "../contexts/UserContext";
import useRandomStringGenerator from "../hooks/useRandomStringGenerator";
import Button from "./Button";
import LocationConfirm from "./LocationPopUp";
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
  Targets: {
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
  }[];
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
    pathPoints: [string, string][];
    taskId: string;
  };
  robotName: string;
  robotId: string;
  createdCostmap: [string, string][];
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
    locationName: string;
  };
}
interface SavedTask {
  robotName: string;
  userName: string;
  taskStartTime: string;
  Targets: {
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
    locationName: string;
  }[];
  taskId: string;
  taskCode: string;
  taskName: string;
  taskPercentage: string;
  taskPriority: string;
}
interface Location {
  locationName: string;
  locationDescription: string;
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
  };
}
interface CanvasProps {
  width: number;
  height: number;
}

const Map: React.FC<CanvasProps> = ({ width, height }) => {
  const { user } = useUserContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [robots, setRobots] = React.useState<Robot[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [selectedRobot, setSelectedRobot] = React.useState<Robot | null>(null);
  const [taskCode, settaskCode] = React.useState<string>("");
  const [locationName, setLocationName] = React.useState<string>("");
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [isUserAdmin, setIsUserAdmin] = React.useState<boolean>(false); // DO NOT COMMIT JUST FOR DEV AS TRUE
  const [disableButtons, setDisableButtons] = React.useState<boolean[]>([]);
  const [savedTasks, setSavedTasks] = React.useState<SavedTask[]>([]);
  const [savedTaskName, setSavedTaskName] = React.useState<string>("");
  const [showCostmap, setShowCostmap] = React.useState(true);
  const [taskMode, setTaskMode] = React.useState<"auto" | "manual">("auto");
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState<
    number | null
  >(null);
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
  const { generateRandomString } = useRandomStringGenerator();
  React.useEffect(() => {
    if (user && user.user_Role === "admin") {
      setIsUserAdmin(true);
    }
  }, [user]);
  React.useEffect(() => {
    const newDisableButtons = tasks.map((task) =>
      locations.some(
        (location) =>
          task.Target.Position.x === location.Target.Position.x &&
          task.Target.Position.y === location.Target.Position.y &&
          task.Target.Orientation.x === location.Target.Orientation.x &&
          task.Target.Orientation.y === location.Target.Orientation.y &&
          task.Target.Orientation.z === location.Target.Orientation.z &&
          task.Target.Orientation.w === location.Target.Orientation.w
      )
    );
    setDisableButtons(newDisableButtons);
  }, [tasks, locations]);
  const handleAddLocation = (index: number) => {
    setSelectedTaskIndex(index);
  };

  const convertCoordinates = (x: number, y: number) => {
    const canvasX = ((x / +1 + 13) / 26) * width;
    const canvasY = ((y / -1 + 13) / 26) * height;

    return { x: canvasX, y: canvasY };
  };
  const reverseCoordinates = (x: number, y: number) => {
    const temp_X = (x / width) * 26 - 13;
    const temp_Y = (y / height) * 26 - 13;
    const X = temp_X;
    const Y = temp_Y * -1;
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
      setArrowEnd({ x: x, y: y });
    }
  };
  const fetchSavedTasks = () => {
    try {
      const savedTasksRef = collection(db, "tasks");

      onSnapshot(savedTasksRef, (snapshot) => {
        const savedTasks: SavedTask[] = snapshot.docs
          .filter((doc) => doc.data().savedTask === true)
          .map((doc) => ({
            ...(doc.data() as SavedTask),
          }));

        setSavedTasks(savedTasks);
      });
    } catch (error) {
      console.log("Error fetching saved tasks: ", error);
    }
  };
  const fetchLocations = () => {
    try {
      const locationsRef = collection(db, "locations");

      const unsubscribe = onSnapshot(locationsRef, (snapshot) => {
        const newLocations: Location[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Location),
        }));

        if (JSON.stringify(newLocations) !== JSON.stringify(locations)) {
          setLocations(newLocations);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.log("Error fetching locations: ", error);
    }
  };
  const fetchRobots = () => {
    try {
      const robotsRef = collection(db, "robots");

      const unsubscribe = onSnapshot(robotsRef, (snapshot) => {
        const newRobots: Robot[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Robot),
        }));

        if (JSON.stringify(newRobots) !== JSON.stringify(robots)) {
          setRobots(newRobots);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.log("Error fetching robots: ", error);
    }
  };
  React.useEffect(() => {
    const unsubscribeLocations = fetchLocations();
    fetchSavedTasks();
    fetchRobots();

    return () => {
      if (unsubscribeLocations) unsubscribeLocations();
    };
  }, []);
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
    return (Math.atan2(deltaY, deltaX) * -180) / Math.PI;
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
  const drawLocations = (ctx: CanvasRenderingContext2D) => {
    locations.forEach((location) => {
      const { x, y } = convertCoordinates(
        parseFloat(location.Target.Position.x),
        parseFloat(location.Target.Position.y)
      );

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.font = "10px Arial";
      ctx.fillText(location.locationName, x - 5, y - 10);
      ctx.fill();
      ctx.stroke();
    });
  };
  const drawPathPoints = (ctx: any, pathPoints: any) => {
    if (pathPoints.length < 2) return;
    const originalStrokeStyle = ctx.strokeStyle;
    ctx.beginPath();
    const startPoint = convertCoordinates(
      parseFloat(pathPoints[0][0]),
      parseFloat(pathPoints[0][1])
    );
    ctx.moveTo(startPoint.x, startPoint.y);

    for (let i = 1; i < pathPoints.length; i++) {
      const { x, y } = convertCoordinates(
        parseFloat(pathPoints[i][0]),
        parseFloat(pathPoints[i][1])
      );
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = originalStrokeStyle;
  };
  const toggleCostmapVisibility = () => {
    setShowCostmap(!showCostmap);
  };
  const toggleTaskMode = () => {
    setTaskMode(taskMode === "auto" ? "manual" : "auto");
  };
  const drawCostmap = (
    ctx: CanvasRenderingContext2D,
    costmap: any,
    selectedRobotName: String
  ) => {
    costmap.forEach((point: any) => {
      const [x, y] = point;
      const { x: canvasX, y: canvasY } = convertCoordinates(
        parseFloat(x),
        parseFloat(y)
      );
      if (!showCostmap) return;
      if (selectedRobot?.robotName === selectedRobotName) {
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      }
      if (selectedRobot?.robotName === undefined) {
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      }
    });
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
            locationName: "",
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
    if (taskMode === "manual") {
      console.log("fasdfdasfdsafadsf");

      switch (true) {
        // INFO: CHANGE LATER DO NOT FORGET
        // case selectedRobot === null && tasks.length === 0:
        //   toast.error("Please select a robot and target position");
        //   break;
        // case selectedRobot !== null && tasks.length === 0:
        //   toast.error("Please give a task to the robot");
        //   break;
        // case selectedRobot === null && tasks.length !== 0:
        //   toast.error("Please select a robot to give a task");
        //   break;
        // case taskCode.trim() === "":
        //   toast.error("Task code cannot be empty");
        //   break;
        default:
          if (tasks.length > 0 && selectedRobot !== null) {
            try {
              // INFO : This is the old way of giving task to robot
              // const res = await axios.post("/robots/addTarget", {
              //   taskName: "",
              //   taskCode: taskCode,
              //   taskPriority: "1",
              //   taskPercentage: "0",
              //   robotName: selectedRobot?.robotName,
              //   linearVelocity: "0",
              //   angularVelocity: "0",
              //   targets: tasks.map((task, index) => ({
              //     targetPosition: task.Target.Position,
              //     targetOrientation: task.Target.Orientation,
              //     targetExecuted: false,
              //     locationName: task.Target.locationName,
              //   })),
              // });
              // toast.success("Task is given to robot successfully");
              const randomNineDigitString = generateRandomString("task");

              const res2 = await axios.post("/tasks/addTasks", {
                taskId: randomNineDigitString,
                userName: user?.username,
                taskName: "MAP",
                taskCode: taskCode,
                taskPriority: "1",
                taskPercentage: "0",
                robotName: selectedRobot?.robotName,
                robotId: selectedRobot?.robotId,
                targets: tasks.map((task, index) => ({
                  targetPosition: task.Target.Position,
                  targetOrientation: task.Target.Orientation,
                  targetExecuted: false,
                  locationName: task.Target.locationName,
                })),
                taskStartTime: new Date().toISOString(),
                savedTask: false,
              });
            } catch (error: any) {
              toast.error(error.response.data.message);
            }
          }
          setTasks([]);
          break;
      }
    } else {
      if (taskCode.trim() === "") {
        toast.error("Task code cannot be empty");
        return;
      }
      if (tasks.length === 0) {
        toast.error("Please give a task to the robot");
        return;
      } else {
        try {
          const res2 = await axios.post("/tasks/addTasks", {
            userName: user?.username,
            taskName: "",
            taskCode: taskCode,
            taskPriority: "1",
            taskPercentage: "0",
            robotName: " ",
            robotId: " ",
            targets: tasks.map((task, index) => ({
              targetPosition: task.Target.Position,
              targetOrientation: task.Target.Orientation,
              targetExecuted: false,
            })),
            taskStartTime: new Date().toISOString(),
          });
          toast.success("Task is given robot will chosen automatically!");
          setTasks([]);
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      }
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
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        drawLocations(ctx);
        robots.forEach((robot) => {
          const { x, y } = convertCoordinates(
            parseFloat(robot.Pose.Position.x),
            parseFloat(robot.Pose.Position.y)
          );
          const orientationAngle = calculateRotationAngle(
            robot.Pose.Orientation
          );
          drawPathPoints(ctx, robot.Task.pathPoints);
          drawCostmap(ctx, robot.createdCostmap, robot.robotName);
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
  }, [robots, width, height, arrowStart, arrowEnd, locations]);
  const handleSavedTaskSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (taskMode === "auto") {
      setTaskMode("manual");
    }
    const selectedTaskName = event.target.value;
    const selectedTask = savedTasks.find(
      (task) => task.taskName === selectedTaskName
    );
    if (selectedTask) {
      const newTasks = selectedTask.Targets.map((target) => ({
        Target: {
          Position: {
            x: target.Position.x,
            y: target.Position.y,
            z: target.Position.z,
          },
          Orientation: {
            x: target.Orientation.x,
            y: target.Orientation.y,
            z: target.Orientation.z,
            w: target.Orientation.w,
          },
          targetExecuted: false,
          locationName: target.locationName,
        },
      }));
      setTasks(newTasks);
      setSavedTaskName("");
    }
    settaskCode(selectedTask?.taskCode || "");
    setSelectedRobot(
      robots.find((robot) => robot.robotName === selectedTask?.robotName) ||
        null
    );
    toast.success(
      <div className="flex flex-col">
        <span>
          <strong>Task Selected Successfully !</strong>
        </span>
        <span>
          <strong>Task Name:</strong> {selectedTaskName}
        </span>
        <span>
          <strong>Task Code:</strong> {selectedTask?.taskCode}
        </span>
        <span>
          <strong>Robot Name:</strong> {selectedTask?.robotName}
        </span>
      </div>,
      {
        className: "flex flex-row ",
      }
    );
  };
  const handleRobotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const robotName = event.target.value;
    const selectedRobot = robots.find((robot) => robot.robotName === robotName);
    setSelectedRobot(selectedRobot || null);
    toast.success("Robot selected successfully: " + robotName);
  };
  const handleTaskCode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    settaskCode(event.target.value);
    toast.success("Task code selected successfully: " + event.target.value);
  };
  const handleLocationSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLocationName = event.target.value;
    if (selectedLocationName) {
      const selectedLocation = locations.find(
        (location) => location.locationName === selectedLocationName
      );
      if (selectedLocation) {
        const { Position, Orientation } = selectedLocation.Target;
        const newTask = {
          Target: {
            Position: {
              x: Position.x,
              y: Position.y,
              z: "0",
            },
            Orientation: {
              x: Orientation.x,
              y: Orientation.y,
              z: Orientation.z,
              w: Orientation.w,
            },
            targetExecuted: false,
            locationName: selectedLocationName,
          },
        };
        setTasks([...tasks, newTask]);
        setLocationName("");
      }
    }
  };

  return (
    <div className="flex flex-row ml-96 justify-center mt-11">
      {selectedTaskIndex !== null && (
        <LocationConfirm
          handleClose={() => setSelectedTaskIndex(null)}
          taskPosition={tasks[selectedTaskIndex].Target.Position}
          taskOrientation={tasks[selectedTaskIndex].Target.Orientation}
        />
      )}
      <div className="mr-10">
        <RobotInfo selectedRobot={selectedRobot} />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row mb-5 gap-2">
          <div className="w-48">
            <select
              className="w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleRobotChange}
              disabled={taskMode === "auto"}
              value={selectedRobot ? selectedRobot.robotName : ""}
            >
              <option value="">Select a robot</option>
              {robots.map((robot) => (
                <option key={robot.robotName} value={robot.robotName}>
                  {robot.robotName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-51">
            <select
              className=" bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleTaskCode}
              value={taskCode}
            >
              <option value="">Select Task Code</option>
              <option value="Patrol">Patrol</option>
              <option value="Docking">Docking</option>
              <option value="Lift">Lift</option>
            </select>
          </div>
          <span className="mr-2">Task Mode:</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={taskMode === "auto"}
              onChange={toggleTaskMode}
            />
            <span className="slider round"></span>
          </label>
          <span className="ml-2">
            {taskMode === "auto" ? "Auto" : "Manual"}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded-lg border-2"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          style={{
            backgroundImage: `url(${CanvasMap})`,
          }}
        />
        <div className="flex justify-between mt-2">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 h-14"
            onClick={giveTaskToRobot}
            title="Give Task"
          ></Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 h-14"
            onClick={toggleCostmapVisibility}
            title={showCostmap ? "Hide Costmaps" : "Show Costmaps"}
          ></Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 h-14"
            onClick={clearTaskList}
            title="Clear Task List"
          ></Button>
        </div>
      </div>
      <div className="gap-10 flex flex-row">
        <div className="flex flex-col gap-3 pl-5 mt-6">
          Task List:
          {tasks.map((task, index) => (
            <div key={index}>
              {task.Target.locationName ? (
                <div className="flex flex-col">
                  <span>
                    <strong>Location Name:</strong> {task.Target.locationName}
                  </span>
                  <span>
                    <strong>Position:</strong> x :{" "}
                    {parseFloat(task.Target.Position.x).toFixed(2)}, y :{" "}
                    {parseFloat(task.Target.Position.y).toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span>
                    <strong>Location Name:</strong> Not Chosen
                  </span>
                  <span>
                    <strong>Position:</strong> x :{" "}
                    {parseFloat(task.Target.Position.x).toFixed(2)}, y :{" "}
                    {parseFloat(task.Target.Position.y).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded w-50 h-10"
                  onClick={() => handleDeleteTask(index)}
                  title="Delete Task"
                ></Button>
                {/* {isUserAdmin && ( */}
                <Button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded disabled:opacity-0  w-50 h-10"
                  onClick={() => handleAddLocation(index)}
                  disabled={disableButtons[index]}
                  title="Add Location"
                ></Button>
                {/* )} */}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 pl-5 mt-6">
          <div className="w-64">
            <select
              onChange={handleLocationSelection}
              value={locationName}
              className="w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option
                  key={location.locationName}
                  value={location.locationName}
                >
                  {location.locationName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-64">
            <select
              onChange={handleSavedTaskSelection}
              value={savedTaskName}
              className="w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Saved Task</option>
              {savedTasks.map((task) => (
                <option key={task.taskName} value={task.taskName}>
                  {task.taskName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;

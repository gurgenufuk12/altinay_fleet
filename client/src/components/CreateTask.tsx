import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../contexts/UserContext";
import CloseIcon from "@mui/icons-material/Close";
import Arrow from "../assets/arrow.svg";
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
    locationName?: string;
  };
}
interface Location {
  locationName: string;
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
interface CreateTaskProps {
  onClose: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose }) => {
  const { user } = useUserContext();
  const taskWindowRef = React.useRef<HTMLDivElement>(null);
  const [robots, setRobots] = React.useState<Robot[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [taskCode, settaskCode] = React.useState<string>("");
  const [taskName, setTaskName] = React.useState<string>("");
  const [locationName, setLocationName] = React.useState<string>("");
  const [taskPriority, setTaskPriority] = React.useState<string>("1");
  const [savedTask, setSavedTask] = React.useState<boolean>(false);

  const [selectedRobot, setSelectedRobot] = React.useState<Robot | null>(null);

  const handleRobotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const robotName = event.target.value;
    const selectedRobot = robots.find((robot) => robot.robotName === robotName);
    setSelectedRobot(selectedRobot || null);
  };
  const handleTaskCode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    settaskCode(event.target.value);
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
        toast.success(
          `Location "${selectedLocationName}" added to the task list successfully`
        );
      }
    }
  };
  const fetchRobots = async () => {
    try {
      const res = await axios.get("/robots/getRobots");
      setRobots(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLocations = async () => {
    try {
      const res = await axios.get("/locations/getLocations");
      setLocations(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchRobots();
    fetchLocations();
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        taskWindowRef.current &&
        !taskWindowRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  const handleClick = async () => {
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
      case taskCode.trim() === "":
        toast.error("Task code cannot be empty");
        break;
      default:
        if (tasks.length > 0 && selectedRobot !== null) {
          try {
            const res = await axios.post("/robots/addTarget", {
              taskName: taskName,
              taskCode: taskCode,
              taskPriority: taskPriority,
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
              taskCode: taskCode,
              taskPriority: taskPriority,
              taskPercentage: "0",
              robotName: selectedRobot?.robotName,
              targets: tasks.map((task, index) => ({
                targetPosition: task.Target.Position,
                targetOrientation: task.Target.Orientation,
                targetExecuted: false,
              })),
              taskStartTime: new Date().toISOString(),
              savedTask: savedTask,
            });
          } catch (error: any) {
            toast.error(error.response.data.message);
          }
        }
        setTasks([]);
        onClose();
        break;
    }
  };
  const handleDeleteLocation = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div
        className="w-2/3 h-4/5 bg-white rounded-lg p-8 relative flex flex-col shadow-lg"
        ref={taskWindowRef}
      >
        <button className="absolute top-2 right-2" onClick={onClose}>
          <CloseIcon className="text-black" />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Task</h1>
        <div className="mb-6 flex flex-col">
          <div className="flex flex-row items-center mb-4">
            <label
              htmlFor="robot"
              className="mr-4 text-gray-800 font-semibold w-1/4"
            >
              Choose Robot :
            </label>
            <div className="relative w-3/4">
              <select
                id="robot"
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800"
                onChange={handleRobotChange}
                value={selectedRobot ? selectedRobot.robotName : ""}
              >
                <option value="">Select Robot</option>
                {robots.map((robot) => (
                  <option key={robot.robotName} value={robot.robotName}>
                    {robot.robotName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <img src={Arrow} alt="robot" className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center mb-4">
            <label
              htmlFor="taskCode"
              className="mr-4 text-gray-800 font-semibold w-1/4"
            >
              Task Code :
            </label>
            <div className="relative w-3/4">
              <select
                id="taskCode"
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800"
                onChange={handleTaskCode}
                value={taskCode}
              >
                <option value="">Select Task Code</option>
                <option value="Patrol">Patrol</option>
                <option value="Docking">Docking</option>
                <option value="Lift">Lift</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <img src={Arrow} alt="task" className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center mb-4">
            <label
              htmlFor="taskName"
              className="mr-4 text-gray-800 font-semibold w-1/4"
            >
              Task Name :
            </label>
            <input
              type="text"
              id="taskName"
              className="border border-gray-400 rounded-lg px-4 py-2 w-3/4 text-gray-800"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center mb-4">
            <label
              htmlFor="taskName"
              className="mr-4 text-gray-800 font-semibold w-1/4"
            >
              Task Priority :
            </label>
            <input
              type="text"
              id="taskPriority"
              className="border border-gray-400 rounded-lg px-4 py-2 w-3/4 text-gray-800"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center mb-4">
            <label
              htmlFor="saveTask"
              className="mr-4 text-gray-800 font-semibold w-1/4"
            >
              Save Task :
            </label>
            <input
              type="checkbox"
              id="saveTask"
              className="border border-gray-400 rounded-lg px-4 py-2 w-3/4 text-gray-800"
              checked={savedTask}
              onChange={(e) => setSavedTask(e.target.checked)}
            />
          </div>
          <div className="flex flex-row items-center">
            <label
              htmlFor="location"
              className="mr-4 text-gray-800 font-semibold w-1/4"
            >
              Choose Location :
            </label>
            <div className="relative w-3/4">
              <select
                id="location"
                onChange={handleLocationSelection}
                value={locationName}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <img src={Arrow} alt="location" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-4 justify-center mb-2"
          >
            <span className="text-gray-800">{index + 1}. Destination: </span>
            <span className="text-gray-800">
              {task.Target.locationName || "No Location"}
            </span>
            <button
              className=" text-white rounded-lg   w-8 h-8"
              onClick={() => handleDeleteLocation(index)}
            >
              <CloseIcon className="text-black" />
            </button>
          </div>
        ))}
        <button
          className="py-2 px-4 bg-blue-500 text-white rounded-lg w-1/3 self-center mt-6"
          onClick={handleClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateTask;

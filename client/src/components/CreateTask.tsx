import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../contexts/UserContext";
import Button from "./Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Arrow from "../assets/arrow.svg";
import isEqual from "lodash/isEqual";
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
    locationDescription?: string;
  };
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
interface SavedTask {
  robotName: string;
  userName: string;
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
    locationDescription: string;
  }[];
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
    taskId: string;
  };
  _id: string;
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
  const [savedTasks, setSavedTasks] = React.useState<SavedTask[]>([]);
  const [selectedSavedTask, setSelectedSavedTask] =
    React.useState<SavedTask | null>(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"editMode" | "defaultMode">(
    "defaultMode"
  );

  const [selectedRobot, setSelectedRobot] = React.useState<Robot | null>(null);

  const handleRobotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const robotName = event.target.value;
    const selectedRobot = robots.find((robot) => robot.robotName === robotName);
    setSelectedRobot(selectedRobot || null);
  };
  const fetchSavedTasks = async () => {
    try {
      const res = await axios.get("/tasks/getSavedTasks");
      setSavedTasks(res.data.data);
    } catch (error) {
      console.log(error);
    }
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
            locationDescription: selectedLocation.locationDescription,
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
    fetchSavedTasks();
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

  const isTaskNameExists = async (taskName: string): Promise<boolean> => {
    try {
      const res = await axios.get(`/tasks/isTaskNameExist/${taskName}`);
      return res.data.isExist;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleClick = async () => {
    if (viewMode === "editMode") {
      if (selectedSavedTask) {
        handleUpdateTask(selectedSavedTask);
      }
      return;
    }
    const isTaskNameExist = await isTaskNameExists(taskName);
    if (isTaskNameExist && !selectedSavedTask) {
      toast.error(`Task name already exists: ${taskName}`);
      return;
    }
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
              robotStatus: "Task In Progress",
              linearVelocity: "0",
              angularVelocity: "0",
              targets: tasks.map((task, index) => ({
                targetPosition: task.Target.Position,
                targetOrientation: task.Target.Orientation,
                targetExecuted: false,
                locationName: task.Target.locationName,
                locationDescription: task.Target.locationDescription,
              })),
            });
            toast.success("Task is given to robot successfully");
            const taskId = res.data.data.Task._id;

            const res2 = await axios.post("/tasks/addTasks", {
              taskId: taskId,
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
                locationName: task.Target.locationName,
                locationDescription: task.Target.locationDescription,
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

  const handleSavedTaskSelection = (task: SavedTask) => {
    setSelectedSavedTask(task);
    const newTasks = task.Targets.map((target) => ({
      Target: {
        ...target,
        locationName: target.locationName,
        locationDescription: target.locationDescription,
      },
    }));
    setTasks(newTasks);
    setTaskName(task.Task.taskName);
    settaskCode(task.Task.taskCode);
    setTaskPriority(task.Task.taskPriority);
    setSelectedRobot(
      robots.find((robot) => robot.robotName === task.robotName) || null
    );
  };

  const handleDeleteTask = async (task: SavedTask | null) => {
    try {
      await axios.put(`/tasks/deleteTask/${task?._id}`);
      toast.success("Task deleted successfully");
      fetchSavedTasks();
      setShowConfirmation(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTask = async (task: SavedTask) => {
    const isRobotChanged = selectedRobot?.robotName !== task.robotName;
    const isTaskCodeChanged = taskCode !== task.Task.taskCode;
    const isTaskNameChanged = taskName !== task.Task.taskName;
    const isTaskPriorityChanged = taskPriority !== task.Task.taskPriority;
    const isTasksChanged = !isEqual(tasks, task.Targets);
    if (isRobotChanged) {
      setSelectedRobot(
        robots.find((robot) => robot.robotName === task.robotName) || null
      );
    }
    if (isTaskCodeChanged) {
      settaskCode(task.Task.taskCode);
    }
    if (isTaskNameChanged) {
      setTaskName(task.Task.taskName);
    }
    if (isTaskPriorityChanged) {
      setTaskPriority(task.Task.taskPriority);
    }
    if (isTasksChanged) {
      setTasks(
        task.Targets.map((target) => ({
          Target: {
            ...target,
            locationName: target.locationName,
            locationDescription: target.locationDescription,
          },
        }))
      );
    }
    setSavedTask(true);

    try {
      const res = await axios.put(`/tasks/updateTask/${task.Task.taskId}`, {
        taskName: taskName,
        taskCode: taskCode,
        taskPriority: taskPriority,
        targets: tasks.map((task) => ({
          targetPosition: task.Target.Position,
          targetOrientation: task.Target.Orientation,
          targetExecuted: false,
          locationName: task.Target.locationName,
          locationDescription: task.Target.locationDescription,
        })),
        savedTask: savedTask,
      });
      toast.success("Task updated successfully");
      setViewMode("defaultMode");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="w-2/3 h-4/5 bg-white rounded-lg p-8 relative flex flex-col shadow-lg overflow-auto">
        <button onClick={onClose} className="absolute top-4 right-4">
          <CloseIcon className="text-black" />
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Task</h1>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <label
                htmlFor="robot"
                className="mr-4 text-gray-800 font-semibold w-1/4"
              >
                Choose Robot:
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
          <div className="flex flex-col">
            <label htmlFor="savedTasks" className="text-gray-800 font-semibold">
              Choose from saved tasks:
            </label>
            <div className="flex flex-col mt-4">
              {savedTasks.map((task) => (
                <div
                  key={task.Task.taskName}
                  className="flex items-center mb-4"
                >
                  <button
                    className={`text-gray-800 mr-2 ${
                      selectedSavedTask &&
                      selectedSavedTask.Task.taskName === task.Task.taskName
                        ? "font-bold"
                        : ""
                    }`}
                    onClick={() => handleSavedTaskSelection(task)}
                  >
                    {task.Task.taskName}
                  </button>
                  <div className="ml-auto flex items-center">
                    <button
                      className="text-red-600 mr-2"
                      onClick={() => {
                        setSelectedSavedTask(task);
                        setShowConfirmation(true);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                    <button
                      className="text-green-600"
                      onClick={() => {
                        setViewMode("editMode");
                        handleSavedTaskSelection(task);
                        setSavedTask(true);
                      }}
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <span className="text-black block">Task Summary:</span>
          <div className="flex flex-col pt-5">
            {tasks.map((task, index) => (
              <div
                key={index}
                className={` flex items-center mb-4 font-bold rounded-lg p-5 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-300"
                }`}
              >
                <span className="text-gray-800">
                  {index + 1}. Destination:{" "}
                  {task.Target.locationName || "No Location"}{" "}
                  {task.Target.locationDescription}
                </span>
                <button
                  className="ml-auto text-red-600"
                  onClick={() => handleDeleteLocation(index)}
                >
                  <DeleteIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className={` flex items-center mb-4 font-bold  p-5 py-2 px-4  text-white rounded-lg self-center mt-8 ${
            viewMode === "editMode" ? " bg-orange-400" : "bg-blue-500"
          }`}
          onClick={handleClick}
        >
          {viewMode === "editMode" ? "Update" : "Submit"}
        </button>
      </div>
      {showConfirmation && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-75">
          <div className="w-80 h-80 bg-white rounded-lg p-8 flex flex-col shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Confirm Deletion
            </h1>
            <p className="text-black">
              Are you sure you want to delete task "
              {selectedSavedTask?.Task.taskName}"?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 px-4 py-2 bg-gray-700 rounded-lg"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => handleDeleteTask(selectedSavedTask)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;

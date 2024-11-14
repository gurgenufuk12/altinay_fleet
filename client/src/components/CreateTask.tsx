import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import randomStringGenerator from "../hooks/useRandomStringGenerator";
import {
  addTask,
  removeSaveFlag,
  updateSavedTask,
  checkSaveTaskExists,
} from "../services/tasksApi";
import { addTargetToRobot } from "../services/robotsApi";
import { Target } from "../types/Target";
import { Task } from "../types/Task";
import { Location } from "../types/Location";
import { Robot } from "../types/Robot";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Button from "./Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Arrow from "../assets/arrow.svg";
import isEqual from "lodash/isEqual";
import { set } from "lodash";

interface CreateTaskProps {
  onClose: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose }) => {
  const authContext = React.useContext(AuthContext);
  const user = authContext?.userProfile;
  const taskWindowRef = React.useRef<HTMLDivElement>(null);
  const [robots, setRobots] = React.useState<Robot[]>([]);
  const [targets, setTargets] = React.useState<Target[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [taskCode, settaskCode] = React.useState<string>("");
  const [taskName, setTaskName] = React.useState<string>("");
  const [locationName, setLocationName] = React.useState<string>("");
  const [taskPriority, setTaskPriority] = React.useState<string>("1");
  const [savedTask, setSavedTask] = React.useState<boolean>(false);
  const [savedTasks, setSavedTasks] = React.useState<Task[]>([]);
  const [selectedSavedTask, setSelectedSavedTask] = React.useState<Task | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"editMode" | "defaultMode">(
    "defaultMode"
  );
  const lastTarget = targets[targets.length - 1];
  const [selectedRobot, setSelectedRobot] = React.useState<Robot | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { generateRandomString } = randomStringGenerator();

  const handleRobotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const robotName = event.target.value;
    const selectedRobot = robots.find((robot) => robot.robotName === robotName);
    setSelectedRobot(selectedRobot || null);
  };
  const fetchSavedTasks = () => {
    try {
      const savedTasksRef = collection(db, "tasks");

      onSnapshot(savedTasksRef, (snapshot) => {
        const savedTasks: Task[] = snapshot.docs
          .filter((doc) => doc.data().savedTask === true)
          .map((doc) => ({
            ...(doc.data() as Task),
          }));

        setSavedTasks(savedTasks);
      });
    } catch (error) {
      toast.error("Error fetching saved tasks");
    }
  };

  const handleTaskCode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    settaskCode(event.target.value);
  };

  const handleLocationSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLocationName = event.target.value;
    if (targets.length > 0) {
      if (selectedLocationName === lastTarget.locationName) {
        toast.error("Location already added to the task list");
        return;
      }
    }
    if (selectedLocationName) {
      const selectedLocation = locations.find(
        (location) => location.locationName === selectedLocationName
      );
      if (selectedLocation) {
        const { Position, Orientation } = selectedLocation.Target;
        const newTarget = {
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
          locationId: selectedLocation.locationId,
          locationName: selectedLocationName,
          locationDescription: selectedLocation.locationDescription,
        };
        setTargets([...targets, newTarget]);
      }
    }
  };
  const fetchRobots = async () => {
    try {
      const robotsRef = collection(db, "robots");

      onSnapshot(robotsRef, (snapshot) => {
        const robots: Robot[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Robot),
        }));

        setRobots(robots);
      });
    } catch (error: any) {
      toast.error(`Error fetching robots: ${error.response.data.message}`);
    }
  };
  const fetchLocations = () => {
    try {
      const locationsRef = collection(db, "locations");

      onSnapshot(locationsRef, (snapshot) => {
        const locations: Location[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Location),
        }));

        setLocations(locations);
      });
    } catch (error: any) {
      toast.error(`Error fetching locations: ${error.response.data.message}`);
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

  const handleClick = async () => {
    if (savedTask) {
      const res = await checkSaveTaskExists(taskName);
      if (res.taskExists && !selectedSavedTask) {
        setError(res.message);
        return;
      }
    }
    if (viewMode === "editMode") {
      if (selectedSavedTask) {
        handleUpdateTask(selectedSavedTask);
      }
      return;
    }

    switch (true) {
      // INFO: CHANGE LATER DO NOT FORGET
      case selectedRobot === null && targets.length === 0:
        setError("Please select a robot and target position");
        break;
      case selectedRobot !== null && targets.length === 0:
        setError("Please give a task to the robot");
        break;
      case selectedRobot === null && targets.length !== 0:
        setError("Please select a robot to give a task");
        break;
      case taskCode.trim() === "":
        setError("Task code cannot be empty");
        break;
      default:
        if (targets.length > 0) {
          const randomNineDigitString = generateRandomString("task");

          try {
            setLoading(true);
            await addTask(
              randomNineDigitString,
              user?.username,
              taskName,
              taskCode,
              taskPriority,
              "0",
              selectedRobot?.robotName,
              selectedRobot?.robotId,
              targets,
              new Date().toISOString(),
              "unknown",
              savedTask
            );
            await addTargetToRobot(
              randomNineDigitString,
              taskName,
              taskCode,
              selectedRobot?.robotId,
              targets,
              taskPriority,
              "0",
              "0",
              [],
              "Task In Progress"
            );
            toast.success("Task added successfully");
          } catch (error: any) {
            toast.error(error.response.data.message);
          } finally {
            setLoading(false);
          }
        }
        setTargets([]);
        onClose();
        break;
    }
  };
  const handleDeleteLocation = (index: number) => {
    const newTargets = targets.filter((_, i) => i !== index);
    setTargets(newTargets);
  };

  const handleSavedTaskSelection = (task: Task) => {
    setSelectedSavedTask(task);
    const newTargets = task.Targets.map((target) => ({
      ...target,
      locationName: target.locationName,
      locationDescription: target.locationDescription,
    }));
    setTargets(newTargets);
    setTaskName(task.Task.taskName);
    settaskCode(task.Task.taskCode);
    setTaskPriority(task.Task.taskPriority);
    setSelectedRobot(
      robots.find((robot) => robot.robotName === task.robotName) || null
    );
  };

  const handleDeleteTask = async (task: Task | null) => {
    try {
      setLoading(true);
      await removeSaveFlag(task?.Task.taskId);
      toast.success("Task deleted successfully");
      setShowConfirmation(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateTask = async (task: Task) => {
    const isRobotChanged = selectedRobot?.robotName !== task.robotName;
    const isTaskCodeChanged = taskCode !== task.Task.taskCode;
    const isTaskNameChanged = taskName !== task.Task.taskName;
    const isTaskPriorityChanged = taskPriority !== task.Task.taskPriority;
    const isTasksChanged = !isEqual(targets, task.Targets);
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
      setTargets(
        task.Targets.map((target) => ({
          ...target,
          locationName: target.locationName,
          locationDescription: target.locationDescription,
        }))
      );
    }
    setSavedTask(true);

    try {
      setLoading(true);
      const res = await updateSavedTask(
        task.Task.taskId,
        taskName,
        taskCode,
        taskPriority,
        targets
      );
      toast.success(res.message);

      setViewMode("defaultMode");
      setTargets([]);
      setSelectedSavedTask(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const conditionalButtonRender = () => {
    switch (viewMode) {
      case "editMode":
        switch (loading) {
          case true:
            return "Updating...";
          default:
            return "Update Task";
        }
      default:
        switch (loading) {
          case true:
            return "Submitting...";
          default:
            return "Submit Task";
        }
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
            {!selectedSavedTask && (
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
            )}
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
              {savedTasks.map((task, idx) => (
                <div key={idx} className="flex items-center mb-4">
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
            {targets.map((target, index) => (
              <div
                key={index}
                className={` flex items-center mb-4 font-bold rounded-lg p-5 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-300"
                }`}
              >
                <span className="text-gray-800">
                  {index + 1}. Destination:
                  {target.locationName || "No Location"}{" "}
                  {target.locationDescription}
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
        <span className="font-semibold text-red-600">{error}</span>
        <button
          className={` flex items-center mb-4 font-bold  p-5 py-2 px-4  text-white rounded-lg self-center mt-8 ${
            viewMode === "editMode" ? " bg-orange-400" : "bg-blue-500"
          }`}
          onClick={handleClick}
        >
          {conditionalButtonRender()}
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
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;

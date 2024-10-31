import axios from "axios";
import { Target } from "../types/Target";

const API_BASE_URL = "http://localhost:8000/tasks";

export const addTask = async (
  taskId: string,
  userName: string | undefined,
  taskName: string,
  taskCode: string,
  taskPriority: string,
  taskPercentage: string,
  robotName: string | undefined,
  robotId: string | undefined,
  targets: Target[],
  taskStartTime: string,
  taskEndTime: string,
  savedTask: boolean
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addTasks`, {
      taskId,
      userName,
      taskName,
      taskCode,
      taskPriority,
      taskPercentage,
      robotName,
      robotId,
      targets,
      taskStartTime,
      taskEndTime,
      savedTask,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const removeSaveFlag = async (taskId: string | undefined) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/deleteTask/${taskId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const updateSavedTask = async (
  taskId: string | undefined,
  taskName: string,
  taskCode: string,
  taskPriority: string,
  targets: Target[]
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateSavedTask/${taskId}`,
      {
        taskName,
        taskCode,
        taskPriority,
        targets,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

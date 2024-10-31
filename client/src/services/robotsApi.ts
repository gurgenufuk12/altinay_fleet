import axios from "axios";
import { Target } from "../types/Target";
const API_BASE_URL = "http://localhost:8000/robots";

export const addRobot = async (robotName: string, robotId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addRobot`, {
      robotName,
      robotId,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const addTargetToRobot = async (
  taskId: string,
  taskName: string,
  taskCode: string,
  robotId: string | undefined,
  targets: Target[],
  taskPriority: string,
  linearVelocity: string,
  angularVelocity: string,
  pathPoints: [],
  robotStatus: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addTarget`, {
      taskId,
      taskName,
      taskCode,
      robotId,
      targets,
      taskPriority,
      linearVelocity,
      angularVelocity,
      pathPoints,
      robotStatus,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

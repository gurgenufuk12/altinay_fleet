import axios, { AxiosRequestConfig } from "axios";
import { Target } from "../types/Target";

const DUMMY_BASE_URL = "http://localhost:8000";

function assertParamExists(
  functionName: string,
  paramName: string,
  paramValue: any
) {
  if (paramValue == null) {
    throw new Error(`${functionName} requires parameter '${paramName}'`);
  }
}

export const addRobot = async (
  robotName: string,
  robotId: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("addRobot", "robotName", robotName);
  assertParamExists("addRobot", "robotId", robotId);

  const localVarPath = `/robots/addRobot`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  const localVarRequestOptions = {
    method: "POST",
    ...options,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.post(
      localVarUrlObj.toString(),
      { robotName, robotId },
      localVarRequestOptions
    );
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
  robotStatus: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("addTargetToRobot", "taskId", taskId);
  assertParamExists("addTargetToRobot", "taskName", taskName);
  assertParamExists("addTargetToRobot", "taskCode", taskCode);

  const localVarPath = `/robots/addTarget`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  const localVarRequestOptions = {
    method: "POST",
    ...options,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.post(
      localVarUrlObj.toString(),
      {
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
      },
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

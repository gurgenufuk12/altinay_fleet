import axios, { AxiosRequestConfig } from "axios";
import { Target } from "../types/Target";
function assertParamExists(
  functionName: string,
  paramName: string,
  paramValue: any
) {
  if (paramValue == null) {
    throw new Error(`${functionName} requires parameter '${paramName}'`);
  }
}

const DUMMY_BASE_URL = "http://localhost:8000";

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
  savedTask: boolean,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("addTask", "taskId", taskId);
  const localVarPath = `/tasks/addTasks`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  let baseOptions = options;

  const localVarRequestOptions = {
    method: "POST",
    ...baseOptions,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.post(
      localVarUrlObj.toString(),
      {
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
      },
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const removeSaveFlag = async (
  taskId: string | undefined,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("removeSaveFlag", "taskId", taskId);
  const localVarPath = `/tasks/deleteTask/${encodeURIComponent(
    String(taskId)
  )}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  let baseOptions = options;

  const localVarRequestOptions = {
    method: "PUT",
    ...baseOptions,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.put(
      localVarUrlObj.toString(),
      {},
      localVarRequestOptions
    );
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
  targets: Target[],
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("updateSavedTask", "taskId", taskId);
  const localVarPath = `/tasks/updateSavedTask/${encodeURIComponent(
    String(taskId)
  )}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  let baseOptions = options;

  const localVarRequestOptions = {
    method: "PUT",
    ...baseOptions,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.put(
      localVarUrlObj.toString(),
      {
        taskName,
        taskCode,
        taskPriority,
        targets,
      },
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const checkSaveTaskExists = async (
  taskName: string | undefined,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("checkSaveTaskExists", "taskName", taskName);
  const localVarPath = `/tasks/checkSaveTaskExists/${encodeURIComponent(
    String(taskName)
  )}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  let baseOptions = options;

  const localVarRequestOptions = {
    method: "GET",
    ...baseOptions,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.get(
      localVarUrlObj.toString(),
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

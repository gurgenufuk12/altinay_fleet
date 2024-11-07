import axios, { AxiosRequestConfig } from "axios";

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

export const changeUserRole = async (
  userId: string,
  newRole: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("changeUserRole", "userId", userId);
  assertParamExists("changeUserRole", "newRole", newRole);

  const localVarPath = `/api/changeUserRole/${encodeURIComponent(userId)}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  const localVarRequestOptions = {
    method: "PUT",
    ...options,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.put(
      localVarUrlObj.toString(),
      { newRole },
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteUser = async (
  userId: string | undefined,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("deleteUser", "userId", userId);

  const localVarPath = `/api/deleteUser/${userId}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  const localVarRequestOptions = {
    method: "DELETE",
    ...options,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.delete(
      localVarUrlObj.toString(),
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

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

export const addLocation = async (
  locationId: string,
  locationName: string,
  Target: {
    Position: { x: string; y: string; z: string };
    Orientation: { x: string; y: string; z: string; w: string };
  },
  locationDescription: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("addLocation", "locationId", locationId);
  assertParamExists("addLocation", "locationName", locationName);

  const localVarPath = `/locations/addLocation`;
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
        locationId,
        locationName,
        Target,
        locationDescription,
      },
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const checkLocationExist = async (
  locationName: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("checkLocationExist", "locationName", locationName);

  const localVarPath = `/locations/checkLocationExist/${encodeURIComponent(
    locationName
  )}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  const localVarRequestOptions = {
    method: "GET",
    ...options,
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

export const deleteLocation = async (
  locationId: string | undefined,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("deleteLocation", "locationId", locationId);

  const localVarPath = `/locations/deleteLocation/${locationId}`;
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

export const updateLocation = async (
  locationId: string | undefined,
  locationName: string | undefined,
  locationDescription: string | undefined,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  assertParamExists("updateLocation", "locationId", locationId);

  const localVarPath = `/locations/updateLocation/${locationId}`;
  const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
  const localVarRequestOptions = {
    method: "PUT",
    ...options,
    headers: { ...options.headers },
  };

  try {
    const response = await axios.put(
      localVarUrlObj.toString(),
      {
        locationName,
        locationDescription,
      },
      localVarRequestOptions
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

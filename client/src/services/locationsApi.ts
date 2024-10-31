import axios from "axios";
const API_BASE_URL = "http://localhost:8000/locations";

export const addLocation = async (
  locationId: string,
  locationName: string,
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
  },
  locationDescription: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addLocation`, {
      locationId,
      locationName,
      Target,
      locationDescription,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const checkLocationExist = async (locationName: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/checkLocationExist/${locationName}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const deleteLocation = async (locationId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteLocation/${locationId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const updateLocation = async (
  locationId: string | undefined,
  locationName: string | undefined,
  locationDescription: string | undefined
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateLocation/${locationId}`,
      {
        locationName,
        locationDescription,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

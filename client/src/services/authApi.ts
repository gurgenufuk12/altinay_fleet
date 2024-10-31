import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api";

export const changeUserRole = async (userId: string, newRole: string) => {
  const response = await axios.put(`${API_BASE_URL}/changeUserRole/${userId}`, {
    newRole,
  });
  return response.data;
};
export const deleteUser = async (userId: string | undefined) => {
  const response = await axios.delete(`${API_BASE_URL}/deleteUser/${userId}`);
  return response.data;
};

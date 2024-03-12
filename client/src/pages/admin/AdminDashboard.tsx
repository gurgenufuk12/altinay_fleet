import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AdminUser {
  username: string;
  user_Role: string;
}

const AdminDashboard = () => {
  const [adminUsers, setAdminUsers] = React.useState<AdminUser[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<{
    [key: string]: string;
  }>({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/getUsers");
      const initialSelectedRoles: { [key: string]: string } = {};
      res.data.data.forEach((user) => {
        initialSelectedRoles[user.username] = user.user_Role;
      });
      setSelectedRoles(initialSelectedRoles);
      setAdminUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    username: string
  ) => {
    const newSelectedRoles = {
      ...selectedRoles,
      [username]: event.target.value,
    };
    setSelectedRoles(newSelectedRoles);
  };

  const saveUserRoleChanges = async (username: string) => {
    try {
      const res = await axios.put(`/admin/changeUserRole/${username}`, {
        newRole: selectedRoles[username],
      });
      const updatedUsers = adminUsers.map((user) => {
        if (user.username === username) {
          return res.data.updatedUser;
        }
        return user;
      });
      setAdminUsers(updatedUsers);
      toast.success("User role updated successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (username: string) => {
    try {
      const res = await axios.delete(`/admin/deleteUser/${username}`);
      const updatedUsers = adminUsers.filter(
        (user) => user.username !== username
      );
      setAdminUsers(updatedUsers);
      toast.success("User deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-400">Username</th>
              <th className="px-4 py-2 border border-gray-400">User Role</th>
              <th className="px-4 py-2 border border-gray-400">Change Role</th>
              <th className="px-4 py-2 border border-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-4 py-2 border border-gray-400">
                  {user.username}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {user.user_Role}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  <select
                    id={`role_${user.username}`}
                    value={selectedRoles[user.username]}
                    onChange={(event) => handleRoleChange(event, user.username)}
                    className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  <button
                    onClick={() => saveUserRoleChanges(user.username)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => deleteUser(user.username)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

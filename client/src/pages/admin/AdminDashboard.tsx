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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {adminUsers.map((user, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 rounded border border-gray-400"
          >
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Username:</p>
              <p>{user.username}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">User Role:</p>
              <p>{user.user_Role}</p>
            </div>
            <div className="flex flex-row">
              <div className="flex flex-row gap-2 mt-2">
                <label htmlFor={`role_${user.username}`}>Change Role:</label>
                <select
                  id={`role_${user.username}`}
                  value={selectedRoles[user.username]}
                  onChange={(event) => handleRoleChange(event, user.username)}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button
                onClick={() => saveUserRoleChanges(user.username)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";

interface AdminUser {
  username: string;
  user_Role: string;
}
interface Robot {
  Pose: {
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
  };
  robotCharge: string;
  robotStatus: string;
  robotVelocity: {
    linearVelocity: string;
    angularVelocity: string;
  };
  Targets: {
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
    targetExecuted: boolean;
  }[];
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
  };
  robotName: string;
}
interface Location {
  locationName: string;
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
  };
}
const AdminDashboard = () => {
  const [adminUsers, setAdminUsers] = React.useState<AdminUser[]>([]);
  const [robots, setRobots] = React.useState<Robot[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<{
    [key: string]: string;
  }>({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/getUsers");
      const initialSelectedRoles: { [key: string]: string } = {};
      res.data.data.forEach((user: any) => {
        initialSelectedRoles[user.username] = user.user_Role;
      });
      setSelectedRoles(initialSelectedRoles);
      setAdminUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRobots = async () => {
    try {
      const res = await axios.get("/robots/getRobots");
      setRobots(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLocations = async () => {
    try {
      const res = await axios.get("/locations/getLocations");
      setLocations(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchUsers();
    fetchRobots();
    fetchLocations();
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

  const deleteLocation = async (locationName: string) => {
    try {
      const res = await axios.delete(
        `/locations/deleteLocation/${locationName}`
      );

      const updatedLocations = locations.filter(
        (location) => location.locationName !== locationName
      );
      setLocations(updatedLocations);
      toast.success("Location deleted successfully");
    } catch (error) {
      toast.error("Error deleting location");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <SideBar />
      <h1 className="text-3xl font-bold mb-4 ml-10">Admin Dashboard</h1>
      <div className="flex ml-10">
        <div className="w-1/2 pr-4">
          <h2 className="text-xl font-bold mb-2">Admin Users</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Change Role</th>
                  <th className="px-4 py-2">Actions</th>
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
                        onChange={(event) =>
                          handleRoleChange(event, user.username)
                        }
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
        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-bold mb-2">Locations</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="px-4 py-2">Location Name</th>
                  <th className="px-4 py-2">Target Position</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="px-4 py-2 border border-gray-400">
                      {location.locationName}
                    </td>
                    <td className="px-4 py-2 border border-gray-400">
                      {location.Target.Position.x}, {location.Target.Position.y}
                      , {location.Target.Position.z}
                    </td>
                    <td className="px-4 py-2 border border-gray-400">
                      <button
                        onClick={() => deleteLocation(location.locationName)}
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
          <h2 className="text-xl font-bold mt-4 mb-2">Robots</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="px-4 py-2">Robot Name</th>
                  <th className="px-4 py-2">Robot Status</th>
                  <th className="px-4 py-2">Robot Charge</th>
                  <th className="px-4 py-2">Robot Velocity</th>
                </tr>
              </thead>
              <tbody>
                {robots.map((robot, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="px-4 py-2 border border-gray-400">
                      {robot.robotName}
                    </td>
                    <td className="px-4 py-2 border border-gray-400">
                      {robot.robotStatus}
                    </td>
                    <td className="px-4 py-2 border border-gray-400">
                      {robot.robotCharge}
                    </td>
                    <td className="px-4 py-2 border border-gray-400">
                      {robot.robotVelocity.linearVelocity},
                      {robot.robotVelocity.angularVelocity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

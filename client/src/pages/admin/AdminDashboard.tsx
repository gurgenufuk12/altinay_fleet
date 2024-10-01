import React from "react";
import axios from "axios";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";
import Button from "../../components/Button";

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
  locationDescription: string;
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
  const fetchLocations = () => {
    try {
      const locationsRef = collection(db, "locations");

      onSnapshot(locationsRef, (snapshot) => {
        const locations: Location[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Location),
        }));

        setLocations(locations);
      });
    } catch (error) {
      console.log("Error fetching locations: ", error);
    }
  };
  React.useEffect(() => {
    // fetchUsers();
    // fetchRobots();
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
    } catch (error: any) {
      toast.error("Error deleting location " + error.response.data.message);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <SideBar />
      <h1 className="text-3xl font-bold mb-4 ml-14 text-gray-800">
        Admin Dashboard
      </h1>
      <div className="flex flex-wrap justify-around ml-14">
        <div className="w-full lg:w-1/2 pr-4 mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Admin Users</h2>
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsers.map((user, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.user_Role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        id={`role_${user.username}`}
                        value={selectedRoles[user.username]}
                        onChange={(event) =>
                          handleRoleChange(event, user.username)
                        }
                        className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => saveUserRoleChanges(user.username)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        title="Save"
                      />
                      <Button
                        onClick={() => deleteUser(user.username)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full lg:w-1/2 pl-4 mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Locations</h2>
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {location.locationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {location.locationDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      x : {parseFloat(location.Target.Position.x).toFixed(2)}, y
                      : {parseFloat(location.Target.Position.y).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => deleteLocation(location.locationName)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full lg:w-1/2 pr-4">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Robots</h2>
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Robot Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Robot Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Robot Charge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Robot Velocity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {robots.map((robot, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {robot.robotName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {robot.robotStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {robot.robotCharge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {robot.robotVelocity.linearVelocity},{" "}
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

import React from "react";
import axios from "axios";
import { Robot } from "../../types/Robot";
import { Location } from "../../types/Location";
import { User } from "../../types/User";
import { deleteLocation } from "../../services/locationsApi";
import { changeUserRole, deleteUser } from "../../services/authApi";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";
import UpdateLocation from "../../components/UpdateLocation";
import Button from "../../components/Button";
import Close from "@mui/icons-material/Close";
import DynamicTable from "../../components/DynamicTable"; // Import DynamicTable

const AdminDashboard = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [robots, setRobots] = React.useState<Robot[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<{
    [key: string]: string;
  }>({});
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [showUpdateLocation, setShowUpdateLocation] = React.useState(false);
  const [selectedLocation, setSelectedLocation] =
    React.useState<Location | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      onSnapshot(usersRef, (snapshot) => {
        const users: User[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as User),
        }));
        setUsers(users);
      });
    } catch (error: any) {
      toast.error(
        "Error fetching users: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  const fetchRobots = async () => {
    try {
      const robotRef = collection(db, "robots");
      onSnapshot(robotRef, (snapshot) => {
        const robots: Robot[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Robot),
        }));
        setRobots(robots);
      });
    } catch (error: any) {
      toast.error(
        "Error fetching robots: " +
          (error.response?.data.message || error.message)
      );
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
    } catch (error: any) {
      toast.error(
        "Error fetching locations: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchRobots();
    fetchLocations();
  }, []);

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    userUid: string
  ) => {
    const newSelectedRoles = {
      ...selectedRoles,
      [userUid]: event.target.value,
    };
    setSelectedRoles(newSelectedRoles);
  };

  const saveUserRoleChanges = async (userUid: string) => {
    try {
      setLoading(true);
      const res = await changeUserRole(userUid, selectedRoles[userUid]);
      const updatedUsers = users.map((user) =>
        user.userUid === userUid
          ? { ...user, userRole: selectedRoles[userUid] }
          : user
      );
      setUsers(updatedUsers);
      toast.success(res.message);
    } catch (error: any) {
      toast.error("Error updating user role: " + error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userUid: string | undefined) => {
    try {
      setLoading(true);
      const res = await deleteUser(userUid);
      const updatedUsers = users.filter((user) => user.userUid !== userUid);
      setUsers(updatedUsers);
      setShowConfirmation(false);
      toast.success(res.message);
    } catch (error: any) {
      toast.error("Error deleting user: " + error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    try {
      const res = await deleteLocation(locationId);
      const updatedLocations = locations.filter(
        (location) => location.locationId !== locationId
      );
      setLocations(updatedLocations);
      toast.success(res.message);
    } catch (error: any) {
      toast.error("Error deleting location: " + error.response?.data.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <SideBar />
      <h1 className="text-3xl font-bold mb-4 ml-14 text-gray-800">
        Admin Dashboard
      </h1>
      <div className="flex flex-wrap justify-around ml-14">
        <div className="w-full lg:w-1/2 pr-4 mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Admin Users</h2>
          <DynamicTable
            data={users}
            headers={["Username", "Role", "Change Role", "Actions"]}
            renderRow={(user, index) => (
              <tr
                key={user.userUid}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.userRole}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    id={`role_${user.userUid}`}
                    value={selectedRoles[user.userUid]}
                    onChange={(event) => handleRoleChange(event, user.userUid)}
                    className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="default">-</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    onClick={() => saveUserRoleChanges(user.userUid)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    title="Save"
                  />
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowConfirmation(true);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    title="Delete"
                  />
                </td>
              </tr>
            )}
          />
        </div>

        <div className="w-full lg:w-1/2 pl-4 mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Locations</h2>
          <DynamicTable
            data={locations}
            headers={[
              "Location Id",
              "Location Name",
              "Location Description",
              "Target Position",
              "Actions",
            ]}
            renderRow={(location, index) => (
              <tr
                key={location.locationId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {location.locationId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {location.locationName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {location.locationDescription}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  x: {parseFloat(location.Target.Position.x).toFixed(2)}, y:{" "}
                  {parseFloat(location.Target.Position.y).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    onClick={() => {
                      setShowUpdateLocation(true);
                      setSelectedLocation(location);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    title="Update"
                  />
                  <Button
                    onClick={() => handleDeleteLocation(location.locationId)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    title="Delete"
                  />
                </td>
              </tr>
            )}
          />
        </div>

        <div className="w-full lg:w-1/2 pr-4">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Robots</h2>
          <DynamicTable
            data={robots}
            headers={[
              "Robot Id",
              "Robot Name",
              "Robot Status",
              "Robot Charge",
              "Robot Velocity",
            ]}
            renderRow={(robot, index) => (
              <tr
                key={robot.robotId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {robot.robotId}
                </td>
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
                  {robot.robotVelocity.linearVelocity}
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {showConfirmation && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="text-lg font-bold">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2"
                title="Cancel"
              />
              <Button
                onClick={() => handleDeleteUser(selectedUser.userUid)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                title="Delete"
              />
            </div>
          </div>
        </div>
      )}

      {showUpdateLocation && selectedLocation && (
        <UpdateLocation
          locaiton={selectedLocation}
          onClose={() => setShowUpdateLocation(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

import React from "react";
import axios from "axios";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";
import Button from "../../components/Button";
import Close from "@mui/icons-material/Close";
import { update } from "lodash";

interface User {
  userUid: string;
  username: string;
  userRole: string;
  userEmail: string;
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
  robotId: string;
}
interface Location {
  locationId: string;
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
  const [locationName, setLocationName] = React.useState("");
  const [locationDescription, setLocationDescription] = React.useState("");

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      onSnapshot(usersRef, (snapshot) => {
        const users: User[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as User),
        }));
        setUsers(users);
      });
    } catch (error) {}
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
    } catch (error) {}
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
      const res = await axios.put(`/api/changeUserRole/${userUid}`, {
        newRole: selectedRoles[userUid],
      });
      const updatedUsers = users.map((user) =>
        user.userUid === userUid
          ? { ...user, userRole: selectedRoles[userUid] }
          : user
      );
      setUsers(updatedUsers);
      toast.success("User role updated successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (userUid: string | undefined) => {
    try {
      const res = await axios.delete(`/api/deleteUser/${userUid}`);
      const updatedUsers = users.filter((user) => user.userUid !== userUid);
      setUsers(updatedUsers);
      setShowConfirmation(false);
      toast.success("User deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const updateLocation = async (locationId: string | undefined) => {
    const isTaskNameChanged = locationName !== selectedLocation?.locationName;
    const isTaskDescriptionChanged =
      locationDescription !== selectedLocation?.locationDescription;
    if (!isTaskNameChanged && !isTaskDescriptionChanged) {
      toast.error("No changes detected");
      return;
    }

    try {
      const res = await axios.put(`/locations/updateLocation/${locationId}`, {
        locationName,
        locationDescription,
      });
      toast.success(res.data.message);
      const updatedLocations = locations.map((location) =>
        location.locationId === selectedLocation?.locationId
          ? { ...location, locationName, locationDescription }
          : location
      );
      setLocations(updatedLocations);
      setShowUpdateLocation(false);
    } catch (error: any) {
      toast.error("Error updating location " + error.response.data.message);
    }
  };
  const deleteLocation = async (locationId: string) => {
    try {
      const res = await axios.delete(`/locations/deleteLocation/${locationId}`);

      const updatedLocations = locations.filter(
        (location) => location.locationId !== locationId
      );
      setLocations(updatedLocations);
      toast.success(res.data.message);
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
                {users.map((user, index) => (
                  <tr
                    key={index}
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
                        onChange={(event) =>
                          handleRoleChange(event, user.userUid)
                        }
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        onClick={() => {
                          setShowUpdateLocation(true);
                          setSelectedLocation(location);
                        }}
                        className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        title="Update"
                      />
                      <Button
                        onClick={() => deleteLocation(location.locationId)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
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
                    Robot Id
                  </th>
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
      {showConfirmation && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-75">
          <div className="w-1000 h-80 bg-white rounded-lg p-8 flex flex-col shadow-lg">
            <Button
              onClick={() => setShowConfirmation(false)}
              className="ml-auto"
              children={<Close />}
            />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Confirm Deletion
            </h1>
            <p className="text-black">
              Are you sure you want to delete user "{selectedUser?.username}"?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 px-4 py-2 bg-gray-700 rounded-lg text-white"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => deleteUser(selectedUser?.userUid)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdateLocation && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-75">
          <div className="w-[600px] h-[500px] bg-white rounded-lg p-8 flex flex-col shadow-lg">
            <Button
              onClick={() => {
                setShowUpdateLocation(false);
                setLocationName("");
                setLocationDescription("");
              }}
              className="ml-auto"
              children={<Close />}
            />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Update Location
            </h1>
            <div className="flex flex-col">
              <div>
                <label htmlFor="locationName" className="text-gray-800">
                  Location Name:
                </label>{" "}
                {selectedLocation?.locationName}
              </div>
              <input
                type="text"
                id="locationName"
                value={locationName}
                onChange={(event) => setLocationName(event.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div>
                <label htmlFor="locationName" className="text-gray-800">
                  Location Description
                </label>{" "}
                {selectedLocation?.locationDescription}
              </div>
              <input
                type="text"
                id="locationDescription"
                value={locationDescription}
                onChange={(event) => setLocationDescription(event.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                title="Update Location"
                onClick={() => updateLocation(selectedLocation?.locationId)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-fit"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

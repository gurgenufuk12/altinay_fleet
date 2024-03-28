import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface LocationConfirmProps {
  handleClose: () => void;
  taskPosition: { x: string; y: string; z: string };
  taskOrientation: { x: string; y: string; z: string; w: string };
}

const LocationConfirm: React.FC<LocationConfirmProps> = ({
  handleClose,
  taskPosition,
  taskOrientation,
}) => {
  const [locationName, setLocationName] = useState("");
  const [locationExists, setLocationExists] = useState<boolean | undefined>();
  const checkLocationExist = async () => {
    try {
      const res = await axios.get(
        `/locations/checkLocationExist/${locationName}`
      );
      setLocationExists(res.data.exists);
      if (res.data.exists) {
        toast.error("Location name already exists");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  const addLocation = async () => {
    if (locationName.trim() === "") {
      toast.error("Location name cannot be empty");
      return;
    }
    if (locationExists) {
      return;
    } else {
      try {
        const res = await axios.post("/locations/addLocation", {
          locationName: locationName,
          Target: {
            Position: taskPosition,
            Orientation: taskOrientation,
          },
        });
        toast.success("Location added successfully");
        setLocationName("");
        handleClose();
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Add Location</h2>
      <input
        type="text"
        placeholder="Location Name"
        className="w-full border rounded-md py-2 px-3 mb-4"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        onBlur={checkLocationExist}
      />
      <div className="flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={addLocation}
          disabled={locationExists}
        >
          Save
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LocationConfirm;

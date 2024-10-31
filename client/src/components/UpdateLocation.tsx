import React, { useState } from "react";
import axios from "axios";
import { Location } from "../types/Location";
import { updateLocation } from "../services/locationsApi";
import Button from "./Button";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";

interface UpdateLocationProps {
  locaiton: Location | null;
  onClose: () => void;
}

const UpdateLocation: React.FC<UpdateLocationProps> = ({
  locaiton,
  onClose,
}) => {
  const [locationName, setLocationName] = useState(locaiton?.locationName);
  const [locationDescription, setLocationDescription] = useState(
    locaiton?.locationDescription
  );
  const handleUpdateLocation = async (locationId: string | undefined) => {
    const isTaskNameChanged = locationName !== locaiton?.locationName;
    const isTaskDescriptionChanged =
      locationDescription !== locaiton?.locationDescription;
    if (!isTaskNameChanged && !isTaskDescriptionChanged) {
      toast.error("No changes detected");
      return;
    }

    try {
      const res = await updateLocation(
        locationId,
        locationName,
        locationDescription
      );
      toast.success(res.message);
      onClose();
    } catch (error: any) {
      toast.error("Error updating location " + error.response.data.message);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-1/3 h-1/3">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateLocation(locaiton?.locationId);
          }}
        >
          <button className="flex self-end mb-5 bg-gray-300 rounded-full p-2 w-[40px] ">
            <Close onClick={onClose} />
          </button>
          <label>Location Name</label>
          <input
            className="border border-gray-300 rounded-md mb-4 p-2"
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />

          <label>Location Description</label>
          <input
            className="border border-gray-300 rounded-md mb-4 p-2"
            type="text"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
          />

          <button
            className="bg-green-500 text-white w-fit p-2 rounded-lg self-center"
            type="submit"
          >
            {" "}
            Update
          </button>
        </form>
      </div>
    </div>
  );
};
export default UpdateLocation;

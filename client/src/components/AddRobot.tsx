import React from "react";
import randomStringGenerator from "../hooks/useRandomStringGenerator";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Button from "./Button";

interface AddRobotProps {
  onClose: () => void;
}

const AddRobot: React.FC<AddRobotProps> = ({ onClose }) => {
  const addRobotWindowRef = React.useRef<HTMLDivElement>(null);
  const [robotName, setRobotName] = React.useState<string>("");
  const { generateRandomString } = randomStringGenerator();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addRobotWindowRef.current &&
        !addRobotWindowRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClick = async () => {
    const robotId = generateRandomString("robot");
    try {
      const res = await axios.post("/robots/addRobot", {
        robotId: robotId,
        robotName: robotName,
      });
      onClose();
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div
        ref={addRobotWindowRef}
        className="w-1/3 h-2/5 bg-white rounded-lg p-8 relative flex flex-col shadow-lg overflow-auto justify-center"
      >
        <h1 className="text-black"> Add Robot</h1>
        <button onClick={onClose} className="absolute top-4 right-4">
          <CloseIcon className="text-black" />
        </button>

        <div className="flex flex-row ">
          <label
            htmlFor="robotName"
            className="mr-4 text-gray-800 font-semibold w-1/4"
          >
            Robot Name
          </label>
          <input
            type="text"
            id="robotName"
            className="border-2 border-gray-800 rounded-lg text-gray-800 "
            onChange={(e) => setRobotName(e.target.value)}
          />
        </div>
        <Button
          className=" flex items-center mb-4 font-bold  p-5 py-2 px-4  text-white rounded-lg self-center mt-8 bg-blue-500
          "
          type="submit"
          onClick={handleClick}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddRobot;

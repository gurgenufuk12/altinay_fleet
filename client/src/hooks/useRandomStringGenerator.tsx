import { useCallback } from "react";

const useRandomStringGenerator = () => {
  const generateRandomString = useCallback((jobType: string): string => {
    const min = 1000000000000000;
    const max = 9999999999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (jobType === "task") {
      return "T" + randomNumber.toString();
    }
    if (jobType === "robot") {
      return "R" + randomNumber.toString();
    }
    return "L" + randomNumber.toString();
  }, []);

  return { generateRandomString };
};

export default useRandomStringGenerator;

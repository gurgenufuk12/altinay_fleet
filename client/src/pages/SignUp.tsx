import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const { username, password } = values;

  const handleChange = (username) => (event) => {
    setValues({ ...values, [username]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const signUser = await axios.post("/api/signup", {
        username,
        password,
      });
      console.log(signUser);
      if (signUser) {
        setValues({ ...values, username: "", password: "" });
        toast.success("Sign up successfully, please sign in to continue");
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange("username")}
                className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={password}
                onChange={handleChange("password")}
                className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="text-sm text-center text-gray-600">
            Already have an account ?{" "}
            <a href="#" className="text-indigo-500 hover:text-indigo-700">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

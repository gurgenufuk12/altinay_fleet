import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Logo from "../../assets/altınay.png";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { username, password } = values;

  const handleChange = (username: any) => (event: any) => {
    setValues({ ...values, [username]: event.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const signUser = await axios.post("/api/signup", {
        username,
        password,
      });
      console.log(signUser);
      if (signUser) {
        setValues({ ...values, username: "", password: "" });
        toast.success("Sign up successfully, redirecting to sign in page...");
        setInterval(() => {
          window.location.href = "/signin";
        }, 2000);
      }
    } catch (error: any) {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex flex-row h-screen p-20 bg-companyRed">
        <div className="flex rounded-xl w-1/2 justify-center items-center">
          <img src={Logo} alt="logo" />
        </div>
        <div className="flex flex-col rounded-xl w-1/2 justify-center items-center">
          <div className="w-1/2 h-1/2">
            <h2 className="text-2xl font-semibold mb-6 text-white">Sign Up</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleChange("username")}
                  className="mt-1 block w-full h-10 rounded-md border shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange("password")}
                  className="mt-1 block w-full h-10 rounded-md border shadow-sm"
                />
              </div>
              <div className="mb-4 flex justify-end">
                <Button
                  type="submit"
                  onClick={(event) => handleSubmit(event)}
                  className=" bg-black text-white py-2 px-4 rounded-md"
                >
                  Sign Up
                </Button>
              </div>
            </form>
            <div className="text-sm text-center text-white flex flex-col gap-2  items-center">
              Already have an account ?{" "}
              <Button
                onClick={() => navigate("/signin")}
                className=" bg-black text-white py-2 px-4 rounded-md"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;

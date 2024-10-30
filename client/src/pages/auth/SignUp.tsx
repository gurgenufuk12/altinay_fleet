import React, { useContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore functions
import Button from "../../components/Button";
import Logo from "../../assets/altınay.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (authContext) {
        await authContext.register(email, password);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border shadow-sm"
                />
              </div>
              <div className="mb-4 flex justify-end">
                <Button
                  type="submit"
                  onClick={(event) => handleRegister(event)}
                  className=" bg-black text-white py-2 px-4 rounded-md"
                >
                  Sign Up
                </Button>
              </div>
              {error && <p className="text-red-600 text-center">{error}</p>}
            </form>
            <div className="text-sm text-center text-white flex flex-col gap-2 items-center">
              Already have an account?
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

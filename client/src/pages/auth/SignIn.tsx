import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useUserContext } from "../../contexts/UserContext";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore functions
import Logo from "../../assets/altınay.png";
import Button from "../../components/Button";

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const auth = getAuth();
  const db = getFirestore();
  const { handleLogin, setIsLoggedIn } = useAuth();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const { username, password } = values;

  const handleChange = (username: any) => (event: any) => {
    setValues({ ...values, [username]: event.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: user.uid,
          username: userData.username,
          user_Role: userData.userRole,
        });

        sessionStorage.setItem(
          "userData",
          JSON.stringify({ token: await user.getIdToken(), uid: user.uid })
        );

        handleLogin();
        setIsLoggedIn(true);

        navigate("/");
      } else {
        throw new Error("User data not found.");
      }
    } catch (error: any) {
      toast.error(error.message);
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
            <h2 className="text-2xl font-semibold mb-6 text-white">Sign In</h2>
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
                  Sign In
                </Button>
              </div>
            </form>
            <div className="text-sm text-center text-white flex flex-col gap-2 items-center">
              Don't have an account yet?
              <Button
                onClick={() => navigate("/signup")}
                className=" bg-black text-white py-2 px-4 rounded-md"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

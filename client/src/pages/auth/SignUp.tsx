import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Logo from "../../assets/altınay.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex items-center justify-center w-1/2 bg-white rounded-l-xl shadow-lg">
        <img src={Logo} alt="logo" className="w-2/3 h-auto" />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 px-8 py-12 bg-gray-800 rounded-r-xl">
        <div className="w-3/4 max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center">Sign Up</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <Button
              type="submit"
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p>Already have an account?</p>
            <Button
              onClick={() => navigate("/signin")}
              className="mt-2 text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

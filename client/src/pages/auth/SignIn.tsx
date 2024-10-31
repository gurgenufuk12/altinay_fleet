import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Logo from "../../assets/altınay.png";
import Button from "../../components/Button";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (authContext) {
        await authContext.login(email, password);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex flex-col items-center justify-center w-1/2 p-10 bg-white rounded-l-xl shadow-lg">
        <img src={Logo} alt="logo" className="w-2/3 h-auto" />
      </div>
      <div className="flex flex-col w-1/2 justify-center items-center px-8 py-12 bg-gray-800 rounded-r-xl">
        <h2 className="text-3xl font-bold mb-8">Welcome Back</h2>
        <form onSubmit={handleLogin} className="w-3/4 max-w-md">
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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button
            type="submit"
            onClick={(event) => handleLogin(event)}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p>Don't have an account?</p>
          <Button
            onClick={() => navigate("/signup")}
            className="mt-2 text-blue-500 hover:text-blue-400 font-medium"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

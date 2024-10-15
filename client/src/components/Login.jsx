import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import Nodado from "../images/logo.png";
import "../index.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve email and password from local storage if "Remember Me" is checked
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8055/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Store email and password if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        onLogin();
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data || "An error occurred. Please try again."
        );
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-auto bg-[#F0F0F0]">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img
            src={Nodado}
            alt="Nodado General Hospital"
            className="h-20 w-20 mr-4"
          />
          <div className="text-left">
          <h1 className="text-3xl font-bold text-[#EA0D10]">HR DEPARTMENT</h1>
            <h2 className="text-lg text-[#090367]">Admin Login</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="mb-4 text-[#EA0D10] text-center">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email} // Bind the email input to state
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              <strong>Password</strong>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Change type based on showPassword
                placeholder="Enter Password"
                name="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password} // Bind the password input to state
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <FaEye className="text-gray-500" /> 
                ) : (
                  <FaEyeSlash className="text-gray-500" /> 
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-[#090367] transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="ml-2 font-medium text-blue-900 hover:text-[#090367]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Nodado from "../images/logo.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMessage("You must agree to the Terms and Conditions to sign up.");
      return;
    }
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8055/register", {
        name,
        email,
        password,
      });
      console.log(response);
      setSuccessMessage("Sign Up Successful! Redirecting to login...");

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-auto">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img
            src={Nodado}
            alt="Nodado General Hospital"
            className="h-20 w-20 mr-4"
          />
          <div className="text-left">
            <h1 className="text-3xl font-bold text-[#EA0D10]">HR DEPARTMENT</h1>
            <h2 className="text-lg text-[#090367]">Sign Up</h2>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 text-[#EA0D10] text-center">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="mb-4 text-green-600 flex items-center justify-center">
            <CheckCircleIcon className="mr-2" /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              <strong>Password</strong>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEye className="text-gray-500" />
                ) : (
                  <FaEyeSlash className="text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the
              <button
                type="button"
                className="text-blue-900 hover:underline ml-1"
                onClick={toggleModal}
              >
                Terms and Conditions
              </button>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-[#090367] transition duration-300 ${
              !agreed ? "cursor-not-allowed" : ""
            }`}
            disabled={!agreed}
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-medium text-blue-900 hover:text-[#090367]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${
          isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-white rounded-lg p-6 max-w-3xl w-full mx-4 transform transition-transform duration-500 ease-in-out ${
            isModalOpen ? "scale-100" : "scale-95"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
          <p className="mb-4">
            Welcome to our website. By signing up, you agree to comply with and
            be bound by these Terms and Conditions...
          </p>
          <h3 className="text-lg font-semibold mb-2">1. Use of the Website</h3>
          <p className="mb-4">[Terms text goes here]</p>
          <h3 className="text-lg font-semibold mb-2">2. Privacy Policy</h3>
          <p className="mb-4">[Privacy policy text]</p>

          <div className="mb-4">
            <input
              type="checkbox"
              id="modalAgree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="modalAgree" className="text-sm text-gray-700">
              I have read and agree to the Terms and Conditions.
            </label>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-[#090367]"
            onClick={toggleModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;

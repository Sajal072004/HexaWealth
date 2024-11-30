"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {toast} from 'react-toastify';

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://hexawealth-backend.onrender.com/api/auth/signup",
        { firstName, lastName, email, password, isAdmin }
      );

      // If signup is successful, store the JWT token and userId in localStorage
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id); // Store userId
        localStorage.setItem("isAdmin", data.user.isAdmin);
        toast.success("Sign Up Successful");
        setTimeout(()=> {
          router.push("/dashboard");
        },1000);
        
      } else {
        setError("Error creating account"); // If no token in response, show error
        toast.error("Error creating account");
      }
    } catch (err) {
      // If there's an error in the request (network error, etc.)
      if (err?.response?.data?.error === "User already exists") {
        setError("User already exists. Please login");
        toast.error("User already exists. Please login");
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      }
      console.error("Signup error:", err); // Log the error for debugging purposes
    }
  };

  const handleHomepageRedirect = () => {
    router.push("/"); // Redirect to homepage
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 md:px-8">
        <h1 className="text-xl md:text-3xl font-bold text-black">
          <span className="text-blue-600 ">Hexa</span>Wealth
        </h1>
        <div className="flex items-center space-x-1 md:space-x-4">
          <button
            onClick={() => router.push("/signup")}
            className="bg-white px-4 py-2 rounded-lg hover:bg-gray-200 text-black border border-black"
          >
            SignUp
          </button>
          <button
            onClick={() => router.push("/login")}
            className="text-black px-4 py-2 rounded-lg hover:bg-gray-300 border border-black"
          >
            Login
          </button>
        </div>
      </header>

      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Signup Form */}
      <div className="flex justify-center items-center h-full relative z-10 mt-16">
        <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] max-w-md p-8 bg-white border border-black text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full px-4 py-2 border border-gray-600 bg-white rounded-md text-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                className="w-full px-4 py-2 border border-gray-600 bg-white rounded-md text-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-600 bg-white rounded-md text-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-600 bg-white rounded-md text-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="mr-2 text-gray-600"
              />
              <label className="text-sm text-gray-600">Admin (for demo)</label>
            </div> */}
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Display error message */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>

          {/* Homepage button */}
          <button
            onClick={handleHomepageRedirect}
            className="w-full mt-4 px-4 py-2 text-black border border-black rounded-md hover:bg-gray-200 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

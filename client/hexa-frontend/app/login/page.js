"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://hexawealth-backend.onrender.com/api/auth/login",
        { email, password }
      );

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("isAdmin", data.user.isAdmin);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      if (err.response?.data?.error === "User not found") {
        setError("User not found. Please register first.");
      } else if (err.response?.data?.error === "Invalid credentials") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", err);
    }
  };

  const handleHomepageRedirect = () => {
    router.push("/"); // Redirect to homepage
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-white">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 md:px-8">
        <h1 className="text-xl md:text-3xl font-bold text-black">
          <span className="text-blue-600">Hexa</span>Wealth
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

      {/* Login Form */}
      <div className="flex justify-center items-center h-full relative z-10 mt-16">
        <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] max-w-md p-8 bg-white border border-black text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
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
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Display error message */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Dont have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
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

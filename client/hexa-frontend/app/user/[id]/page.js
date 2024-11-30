"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns"; // Add date-fns for formatting

const User = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const token = localStorage.getItem("token"); // Assuming token-based authentication
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          `https://hexawealth-backend.onrender.com/api/auth/user/${userId}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setUserInfo(res.data.user);
      } catch (err) {
        setError("An error occurred while fetching user information.");
      }
    };

    const fetchPendingPosts = async () => {
      try {
        const res = await axios.get(
          "https://hexawealth-backend.onrender.com/api/posts/pending",
          {
            headers: { Authorization: `${token}` },
          }
        );

        // Reverse the response data
        const reversedData = res.data.reverse();
        console.log("pending posts", reversedData);
        // Set the reversed data in state
        setPendingPosts(reversedData);
      } catch (err) {
        setError("An error occurred while fetching pending posts.");
      }
    };

    fetchUserInfo();
    fetchPendingPosts();
  }, [token]);

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-white  z-0"></div>

      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 md:px-8">
        <h1 className="text-3xl font-bold text-black">
          <span className="text-blue-600 ">User</span>Page
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="text-black hover:bg-gray-200 px-4 py-2 rounded-md border border-black"
        >
          Home
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-80px)] p-6 container mx-auto relative z-10">
        {/* Error Display */}
        {error && <p className="text-red-500">{error}</p>}

        {/* User Info */}
        {userInfo ? (
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-700 text-white mb-6 w-full max-w-lg">
            <div className="flex flex-col md:flex-row  items-center space-y-4 md:space-y-0 md:space-x-4 justify-center">
              <div className="bg-black w-16 h-16 flex justify-center items-center rounded-full text-2xl font-bold">
                {userInfo.firstName[0]}
              </div>
              <div>
                <h3 className="text-2xl text-gray-900 font-bold text-center">
                  {userInfo.firstName} {userInfo.lastName}
                </h3>
                <p className="text-gray-600 text-center">{userInfo.email}</p>
                <p className="text-sm text-green-500 mt-1 text-center">
                  {userInfo.isAdmin ? "Administrator" : "Regular User"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Loading user information...</p>
        )}

        <h1 className="text-2xl text-gray-700 my-4 mb-12">Your Posts</h1>

        {/* Pending Posts */}

        {pendingPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {pendingPosts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white bg-opacity-10 rounded-lg shadow-lg border border-gray-200 hover:cursor-pointer  text-white"
                style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)" }}
              >
                <div
                  className="hover:cursor-pointer"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  {!post.isApproved && (
                    <div className="text-black">
                      Status : <span className="text-red-500">Pending</span>{" "}
                    </div>
                  )}
                  {post.isApproved && (
                    <div className="text-black">
                      Status : <span className="text-green-500">Approved</span>{" "}
                    </div>
                  )}
                  <div className="flex justify-between mt-1 text-3xl">
                    <h4 className="font-semibold text-black">{post.title}</h4>
                  </div>
                  <div className="flex justify-between mb-4">
                    <h4 className="font-semibold text-gray-500">
                      {post.userId?.email}
                    </h4>
                  </div>

                  <div className="mt-2 mb-4 space-x-2 ">
                    {post.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white text-black border border-black px-3 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Display first 20 words of content */}
                  <p className="font-semibold mb-2 text-lg text-gray-800">
                    {post.content.split(" ").slice(0, 10).join(" ")}...
                  </p>
                  <button
                    className="text-gray-600 underline"
                    onClick={() => router.push(`/posts/${post._id}`)}
                  >
                    Read More
                  </button>

                  {/* Show the posted date and time */}
                  <div className="mt-2 text-sm text-gray-400">
                    Posted on:{" "}
                    {format(new Date(post.createdAt), "MMM dd, yyyy HH:mm:ss")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No pending posts.</p>
        )}
      </div>
    </div>
  );
};

export default User;

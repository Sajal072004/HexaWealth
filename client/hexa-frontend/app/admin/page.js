"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function Admin() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setUserId(userId);
    if (!token) {
      router.push("/login");
    }

    const fetchPosts = async () => {
      try {
        // Fetch pending posts
        const pendingRes = await axios.get(
          "https://hexawealth-backend.onrender.com/api/posts/admin/pending",
          {
            headers: { Authorization: `${token}` },
          }
        );
        setPendingPosts(pendingRes.data);

        // Fetch approved posts
        const approvedRes = await axios.get(
          "https://hexawealth-backend.onrender.com/api/posts/admin/approved",
          {
            headers: { Authorization: `${token}` },
          }
        );
        setApprovedPosts(approvedRes.data);
      } catch (err) {
        setError("An error occurred while fetching posts.");
      }
    };

    fetchPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `https://hexawealth-backend.onrender.com/api/posts/${postId}/approve`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.status === 200) {
        setPendingPosts(pendingPosts.filter((post) => post._id !== postId));
        setApprovedPosts([...approvedPosts, res.data]); // Add the approved post to approved posts
      } else {
        setError("Error approving the post");
      }
    } catch (err) {
      setError("An error occurred while approving the post.");
    }
  };

  const handleDelete = async (postId, type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `https://hexawealth-backend.onrender.com/api/posts/${postId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.status === 200) {
        if (type === "pending") {
          setPendingPosts(pendingPosts.filter((post) => post._id !== postId));
        } else {
          setApprovedPosts(approvedPosts.filter((post) => post._id !== postId));
        }
      } else {
        setError("Error deleting the post");
      }
    } catch (err) {
      setError("An error occurred while deleting the post.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div className="absolute inset-0 bg-white z-0"></div>

      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 px-8">
        <h1 className="text-3xl font-bold text-black">
          <span className="text-blue-600">Admin</span>Panel
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-black hover:bg-gray-200 px-4 py-2 rounded-md border border-black"
        >
          Home
        </button>
      </header>

      <div className="p-6 container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mt-6 mb-8 text-black">
          Pending Posts
        </h2>
        {error && <p className="text-red-500">{error}</p>}

        {pendingPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {pendingPosts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white bg-opacity-10 rounded-lg shadow-lg border border-gray-200 hover:cursor-pointer text-white"
                style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)" }}
              >
                <div
                  className="hover:cursor-pointer"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  <h4 className="font-semibold text-black mb-4 text-3xl">
                    {post.title}
                  </h4>
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
                    {post &&
                      post.content &&
                      post.content.split(" ").slice(0, 10).join(" ")}
                    ...
                  </p>
                </div>
                <button
                  className="text-gray-600 underline"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  Read More
                </button>
                <div className="mt-2 text-sm text-gray-400">
                  Posted on:{" "}
                  {format(new Date(post.createdAt), "MMM dd, yyyy HH:mm:ss")}
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => handleApprove(post._id)}
                    className="text-white px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(post._id, "pending")}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No pending posts to display.</p>
        )}

        <h2 className="text-4xl font-bold mb-8 mt-10 text-black">
          Approved Posts
        </h2>
        {approvedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {approvedPosts.map((post) => (
              <div
                key={post._id || "fda"}
                className="p-4 bg-white bg-opacity-10 rounded-lg shadow-lg border border-gray-200 hover:cursor-pointer text-white"
                style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)" }}
              >
                <div
                  className="hover:cursor-pointer"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  <h4 className="font-semibold text-black text-3xl mb-4">
                    {post.title}
                  </h4>

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
                    {post &&
                      post.content &&
                      post.content.split(" ").slice(0, 10).join(" ")}
                    ...
                  </p>
                  <button
                    className="text-gray-600 underline"
                    onClick={() => router.push(`/posts/${post._id}`)}
                  >
                    Read More
                  </button>
                </div>

                {post && post.createdAt && (
                  <div className="mt-2 text-sm text-gray-400">
                    Posted on:{" "}
                    {format(new Date(post.createdAt), "MMM dd, yyyy HH:mm:ss")}
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(post._id, "approved")}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No approved posts to display.</p>
        )}
      </div>
    </div>
  );
}

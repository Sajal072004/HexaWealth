"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useRouter } from "next/navigation";

const Post = ({ params }) => {
  const { id } = React.use(params); // Unwrap params correctly
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [user, setUser] = useState({});
  const [canComment, setCanComment] = useState(null); // Track `canComment` explicitly
  const [currName, setCurrName] = useState();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const userRes = await axios.get(
          `https://hexawealth-backend.onrender.com/api/auth/user/${userId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setUser(userRes.data.user);
        setIsAdmin(userRes.data.user.isAdmin);
        setCurrName(
          userRes.data.user.firstName + " " + userRes.data.user.lastName
        );
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch post and comments
  useEffect(() => {
    if (!id) return;

    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const postRes = await axios.get(
          `https://hexawealth-backend.onrender.com/api/posts/post/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setPost(postRes.data);

        const commentsRes = await axios.get(
          `https://hexawealth-backend.onrender.com/api/comments/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setComments(commentsRes.data);
      } catch (err) {
        setError("Error fetching post data");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  // Calculate `canComment`
  useEffect(() => {
    if (post && user) {
      const isAdmin1 = localStorage.getItem("isAdmin") === "true";
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      setCanComment(
        (isAdmin1 || user.isAdmin || post.userId._id === userId) &&
          Boolean(token)
      );
    }
  }, [post, user]);

  const commentHandler = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const newComment = {
      userId: userId,
      postId: post._id,
      content: commentInput,
      username: user.firstName,
      createdAt: new Date().toISOString(),
    };

    setComments((prevComments) => [...prevComments, newComment]);

    try {
      await axios.post(
        "https://hexawealth-backend.onrender.com/api/comments",
        {
          userId: userId,
          postId: post._id,
          content: commentInput,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setCommentInput("");
    } catch (err) {
      console.error("Error posting comment:", err);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.content !== newComment.content)
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  if (loading || canComment === null) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div className="absolute inset-0 bg-white z-0"></div>

      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 md:px-8">
        <h1 className="text-xl md:text-3xl font-bold text-black">
          <span className="text-blue-600">Hexa</span>Wealth
        </h1>
        <div className="flex items-center space-x-1 md:space-x-4">
          <button
            onClick={() => router.push(`/dashboard`)}
            className="text-black px-4 py-2 rounded-lg hover:bg-gray-300 border border-black"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Post Details */}
      <div className="p-6 container mx-auto relative z-10 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg sm:w-full md:w-[50%]">
          <div>
            <h2 className="text-4xl lg:text-5xl mb-8 font-semibold text-black">
              {post.title}
            </h2>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
                {post.userId.firstName?.[0] || currName?.[0]}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {post.userId.firstName} {post.userId.lastName}
                </h2>
                <div className="text-sm text-gray-400">
                  Posted on:{" "}
                  {format(new Date(post.createdAt), "MMM dd, yyyy HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-700 mt-4">{post.content}</p>

          <div className="mt-8">
            <h3 className="text-2xl mb-4 font-semibold text-black">Comments</h3>
            {canComment && (
              <div className="mt-6">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-600 rounded-md text-black"
                />
                <button
                  onClick={commentHandler}
                  className="mt-4 bg-blue-600 text-white p-2 rounded-md mb-4"
                >
                  Post Comment
                </button>
              </div>
            )}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id || "f"}
                  className="bg-gray-100 p-4 rounded-lg mb-4"
                >
                  <p className="font-semibold text-gray-600">
                    {comment.userId?.firstName && comment.userId?.lastName
                      ? `${comment.userId.firstName} ${comment.userId.lastName}`
                      : currName}
                  </p>

                  <p className="text-gray-900 my-2">{comment.content}</p>
                  <div className="text-sm text-gray-400">
                    Posted on:{" "}
                    {format(
                      new Date(comment.createdAt),
                      "MMM dd, yyyy HH:mm:ss"
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

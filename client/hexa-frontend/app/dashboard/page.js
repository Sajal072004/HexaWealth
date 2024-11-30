"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AiOutlineLike , AiFillLike } from "react-icons/ai";

import AddPost from "../_components/AddPost";
import { format } from "date-fns";
import { FaRegComment } from "react-icons/fa";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [commentInput, setCommentInput] = useState({});
  
  const [currPost, setCurrPost] = useState("");
  const [showCommentsDialog, setShowCommentsDialog] = useState(false); // New state for dialog visibility
  const [selectedPost, setSelectedPost] = useState(null); // Selected post for showing comments
  const router = useRouter();

  const [token, setToken] = useState("");
const [userId, setUserId] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  setToken(token);
  setUserId(userId);
},[]);

  

  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const commentHandler = async () => {
    try {
      console.log("req bdoy of comment ", {
        userId: userId,
        postId: selectedPost._id,
        content: commentInput[selectedPost._id],
      });

      const res = await axios.post(
        "https://hexawealth-backend.onrender.com/api/comments",
        {
          userId: userId,
          postId: selectedPost._id,
          content: commentInput[selectedPost._id],
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setCommentInput("");
      setSelectedPost(null);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const fetchLikesState = async (postId) => {
    try {
      const res = await axios.get(
        `https://hexawealth-backend.onrender.com/api/likes?postId=${postId}&userId=${userId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.data.exists; // Return whether the user has liked the post
    } catch (err) {
      console.error("Error fetching like state:", err);
      return false;
    }
  };

  const fetchLikesCount = async (postId) => {
    try {
      const res = await axios.get(
        `https://hexawealth-backend.onrender.com/api/likes/likes?postId=${postId}`
      );
      return res.data.likesCount || 0;
    } catch (err) {
      console.error("Error fetching likes count:", err);
      return 0;
    }
  };

  const fetchCommentsCount = async (postId) => {
    try {
      const res = await axios.get(
        `https://hexawealth-backend.onrender.com/api/comments?postId=${postId}`
      );
      return res.data.commentsCount || 0;
    } catch (err) {
      console.error("Error fetching likes count:", err);
      return 0;
    }
  };

  useEffect(() => {
    
    if (!token) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        // Fetch user info
        const userRes = await axios.get(
          `https://hexawealth-backend.onrender.com/api/auth/user/${userId}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        console.log("this is userinfo", userRes.data.user);
        setUserInfo(userRes.data.user);

        const postsRes = await axios.get(
          "https://hexawealth-backend.onrender.com/api/posts",
          {
            headers: { Authorization: `${token}` },
          }
        );

        const updatedPosts = await Promise.all(
          postsRes.data.map(async (post) => {
            const likesCount = await fetchLikesCount(post._id);
            const liked = await fetchLikesState(post._id); // Fetch the like state
            const commentsCount = await fetchCommentsCount(post._id);

            return { ...post, likesCount, liked, commentsCount };
          })
        );

        const reversePosts = updatedPosts.reverse();

        setPosts(reversePosts);
      } catch (err) {
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [currPost]);

  const fetchComments = async (postId) => {
    try {
      const commentsRes = await axios.get(
        `https://hexawealth-backend.onrender.com/api/comments/${postId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      const commentData = commentsRes.data.reverse();
      setSelectedPost((prevPost) =>
        prevPost._id === postId
          ? { ...prevPost, comments: commentData, showComments: true }
          : prevPost
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const likeRes = await axios.get(
        `https://hexawealth-backend.onrender.com/api/likes?postId=${postId}&userId=${userId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      const alreadyLiked = likeRes.data.exists;

      if (alreadyLiked) {
        // Remove the like
        await axios.delete(
          "https://hexawealth-backend.onrender.com/api/likes",
          {
            data: { userId, postId },
            headers: { Authorization: `${token}` },
          }
        );

        setPosts(
          posts.map((post) =>
            post._id === postId
              ? { ...post, liked: false, likesCount: post.likesCount - 1 }
              : post
          )
        );
      } else {
        // Like the post
        await axios.post(
          "https://hexawealth-backend.onrender.com/api/likes",
          { userId, postId },
          {
            headers: { Authorization: `${token}` },
          }
        );

        setPosts(
          posts.map((post) =>
            post._id === postId
              ? { ...post, liked: true, likesCount: post.likesCount + 1 }
              : post
          )
        );
      }
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  const toggleComments = (postId) => {
    setSelectedPost(posts.find((post) => post._id === postId));
    setShowCommentsDialog(true); // Open dialog
    fetchComments(postId);
  };

  const handleAdminRedirect = () => router.push("/admin");
  const handleUserRedirect = () => router.push(`/user/${userId}`);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div className="absolute inset-0 z-0 bg-white"></div>

      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 md:px-8">
        <h1 className="text-xl md:text-3xl font-bold text-black">
          <span className="text-blue-600 ">Hexa</span>Wealth
        </h1>
        <div className="flex items-center space-x-1 md:space-x-4">
          {userInfo?.isAdmin && (
            <button
              onClick={handleAdminRedirect}
              className="bg-white px-4 py-2 rounded-lg hover:bg-gray-200 text-black border border-black "
            >
              Admin
            </button>
          )}
          <button
            onClick={handleUserRedirect}
            className=" text-black px-4 py-2 rounded-lg hover:bg-gray-300 border border-black"
          >
            User
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="p-6 container mx-auto relative z-10">
        <div className="flex justify-between items-center mr-4 mb-8">
          <h2 className="text-4xl font-bold  py-2 px-2 text-gray-900">
            Welcome, {userInfo?.firstName} {userInfo?.lastName}
          </h2>
          <AddPost
            userId={userId}
            token={token}
            onPostAdded={handlePostAdded}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 bg-white bg-opacity-10 rounded-lg shadow-lg border border-gray-200  text-white"
                  style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)" }}
                >
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => router.push(`/posts/${post._id}`)}
                  >
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
                  </div>
                  <p
                    className="font-semibold ml-1 mb-2 text-sm text-gray-500 hover:cursor-pointer"
                    onClick={() => router.push(`/posts/${post._id}`)}
                  >
                    {/* {post.content} */}
                    Read More...
                  </p>
                  <div className="flex items-center space-x-4">
                    {" "}
                    {/* space between like and comment */}
                    <div className="flex items-center space-x-2">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleLike(post._id)}
                      >
                        {post.liked ? (
                          <AiFillLike className="text-black text-xl" />
                        ) : (
                          <AiOutlineLike className="text-black text-xl" />
                        )}
                      </div>
                      <span className="text-black text-lg">
                        {post.likesCount}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="flex items-center text-gray-600 space-x-2"
                    >
                      <FaRegComment className="text-xl text-black" />
                      <span className="text-lg">{post.commentsCount}</span>
                    </button>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    Posted on:{" "}
                    {format(new Date(post.createdAt), "MMM dd, yyyy HH:mm:ss")}
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </div>

      {showCommentsDialog && selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20"
          onClick={() => setShowCommentsDialog(false)}
        >
          <div
            className="bg-white text-black p-8 rounded-lg max-w-lg w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCommentsDialog(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-md font-semibold mb-4 text-gray-600">
              {selectedPost.title} - {selectedPost.userId.email}
            </h3>
            <h3 className="text-2xl font-semibold mb-0">Comments</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
              {selectedPost.comments?.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-700 py-4"
                >
                  <p className="font-semibold text-gray-600 text-sm">
                    {comment.userId.email}
                  </p>
                  <p className="text-gray-700 text-md mt-2">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>

            {(userInfo?.isAdmin || selectedPost._id == userId) && (
              <textarea
                value={commentInput[selectedPost._id] || ""}
                onChange={(e) =>
                  setCommentInput({
                    ...commentInput,
                    [selectedPost._id]: e.target.value,
                  })
                }
                className="mt-4 p-3 w-full border border-gray-600 bg-white text-black rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Add a comment"
              />
            )}
            {(userInfo?.isAdmin || selectedPost._id == userId) && (
              <button
                onClick={commentHandler}
                className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-500 transition duration-300"
              >
                Add Comment
              </button>
            )}

            {userInfo?.isAdmin && selectedPost._id == userId && (
              <p>Only admins and post owner can comment</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

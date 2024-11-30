"use client";

import { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

export default function AddPost({ userId, token, onPostAdded }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = async () => {
    try {
      const tagsArray = postData.tags.split(",").map((tag) => tag.trim());

      console.log("the data to be posted is ", {
        userId: userId,
        title: postData.title,
        content: postData.content,
        tags: tagsArray,
      });

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        {
          userId: userId,
          title: postData.title,
          content: postData.content,
          tags: tagsArray,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("the response is ", response);

      if (response.status === 201) {
        setPostData({ title: "", content: "", tags: "" });
        setIsDialogOpen(false);
      }
    } catch (err) {
      setError("Failed to add post. Please try again.");
      console.error(err);
    }
  };

  

  return (
    <div>
      <button
  className=" px-4 py-2 rounded-md bg-black"
  onClick={() => setIsDialogOpen(true)}
>
  <FaPlus/>
</button>


      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-20"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white border border-black text-black p-8 rounded-lg max-w-lg w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDialogOpen(false)}
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

            <h3 className="text-2xl font-semibold mb-6">Create a New Post</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-900">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={postData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-600 bg-white text-black rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-900">
                  Content
                </label>
                <textarea
                  name="content"
                  value={postData.content}
                  onChange={handleInputChange}
                  className="w-full border border-gray-600 bg-white text-black rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter post content"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-900">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={postData.tags}
                  onChange={handleInputChange}
                  className="w-full border border-gray-600 bg-white text-black rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePostSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-300"
              >
                Add Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

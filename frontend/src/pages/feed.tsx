import { Post } from "../components/post";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

import HomeIcon from "../assets/icons/home.svg?react";
import MeIcon from "../assets/icons/me.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";

type PostProps = {
  id: number;
  name: string;
  username: string;
  profileImage: string;
  content: string;
  postImage?: string;
  comments: number;
  likes: number;
  retweets: number;
  created_at: string;
};

export function Feed() {
  //states
  const [postMessage, setPostMessage] = useState("");
  const [Posts, UsePosts] = useState<PostProps[]>([]);

  //consts
  const token = useAuthStore((state) => state.accessToken);
  const validPost = postMessage.length >= 1 && postMessage.length <= 500;

  // UseEffects
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/posts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.results);
        UsePosts(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [token]);

  const api = axios.create({
    baseURL: "http://localhost:8000/api/posts",
    withCredentials: true,
  });
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            "http://localhost:8000/token/refresh",
            {},
            { withCredentials: true },
          );

          localStorage.setItem("access", res.data.access);

          originalRequest.headers["Authorization"] =
            `Bearer ${res.data.access}`;

          return api(originalRequest);
        } catch (err) {
          console.log(err);
        }
      }

      return Promise.reject(error);
    },
  );

  // Body
  return (
    // Left Side
    <div className="bg-black min-h-screen text-[#E7E9EA] flex justify-center">
      <div className="flex w-full max-w-[1200px]">
        <div className="w-[275px] px-2 border-r border-stone-800">
          <div className="top-0 py-2 mr-8">
            <XIcon className="fill-[#E7E9EA] w-8 h-8 ml-3 mb-4 cursor-pointer" />
            <button className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300">
              <HomeIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Home</h2>
            </button>
            <button className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300">
              <MeIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Me</h2>
            </button>
            <button className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300">
              <SettingsIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Settings</h2>
            </button>
          </div>
        </div>

        {/* mid side */}
        <div className="border-r border-stone-800">
          <div className="grid grid-cols-2 border-b border-stone-800">
            <div className="p-4 cursor-pointer font-bold text-center hover:bg-stone-900">
              <div className="inline-block">
                For you
                <div className="h-1 bg-blue-400 rounded-full mt-1" />
              </div>
            </div>
            <div className="p-4 cursor-pointer text-stone-500 font-bold text-center hover:bg-stone-900">
              Following
            </div>
          </div>

          <div className="flex flex-col p-4 border-b border-stone-800">
            <div className="flex">
              <img
                src="https://placehold.co/48x48"
                alt="profile_picture"
                className="rounded-full w-12 h-12 min-h-12 min-w-12 object-cover"
              />
              <textarea
                placeholder="What's happening?"
                className="bg-transparent outline-none ml-4 text-[20px] w-full text-sm text-[#E7E9EA] placeholder-stone-500 resize-none border-b border-stone-800"
                onChange={(s) => {
                  setPostMessage(s.target.value);
                  s.target.style.height = "auto";
                  s.target.style.height = s.target.scrollHeight + "px";
                }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                disabled={!validPost}
                className={`text-black font-bold p-2 pr-4 pl-4 rounded-full transition-all duration-300 ${
                  validPost
                    ? "bg-[#E7E9EA] text-black hover:bg-[#cfcfcf] cursor-pointer"
                    : "bg-stone-700 text-black opacity-50 cursor-not-allowed"
                }
              `}
              >
                Post
              </button>
            </div>
          </div>
          {Posts.map((post) => (
            <Post
              key={post.id}
              name={post.name}
              username={post.username}
              profileImage={post.profileImage}
              comments={post.comments}
              likes={post.likes}
              retweets={post.retweets}
              content={post.content}
              postImage={post.postImage}
              created_at={post.created_at}
            />
          ))}
        </div>

        {/* right side */}
        <div className="w-[420px] px-4">
          <div className="top-0 pt-2">
            <div className="bg-zinc-900 border border-stone-800 rounded-full px-4 py-2 focus-within:border-blue-500">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
            </div>

            <div className="bg-zinc-900 border border-stone-800 rounded-xl mt-4 p-4">
              <h2 className="font-bold text-lg">What's happening</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

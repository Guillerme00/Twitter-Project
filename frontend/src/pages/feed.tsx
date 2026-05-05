import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

import HomeIcon from "../assets/icons/home.svg?react";
import MeIcon from "../assets/icons/me.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";
import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";

import { CommentInPost } from "../components/comment";

type ActualUser = {
  id: number;
  name: string;
  email: string;
  username: string;
  profile_image: string;
  profile_banner: string;
  bio: string;
  followers_count: number;
  following_count: number;
  bithday: string;
};

type PostProps = {
  author: {
    bio: string;
    birthday: string;
    email: string;
    followers_count: number;
    following_count: number;
    id: number;
    name: string;
    profile_banner: string;
    profile_image: string;
    username: string;
  };
  comments: [];
  created_at: string;
  id: number;
  likes: number[];
  likes_count: number;
  medias: {
    id: number;
    file: string;
    order: number;
  }[];
  post_body: string;
  retweets: {
    author: number,
    created_at: string,
    id: number,
    post: number
  }[];
};

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { setAccessToken } = useAuthStore.getState();
        const res = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          {},
          { withCredentials: true },
        );

        setAccessToken(res.data.access);

        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (err) {
        console.log(err);
      }
    }

    return Promise.reject(error);
  },
);

export function Feed() {
  //consts
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  //states
  const [actualUser, setActualUser] = useState<ActualUser | null>(null);
  const [postMessage, setPostMessage] = useState("");
  const [Posts, UsePosts] = useState<PostProps[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  //functions
  const validPost = postMessage.length >= 1 && postMessage.length <= 500;

  function CalcTemp(created_at: string) {
    const now = new Date();
    const postDate = new Date(created_at);
    const time = now.getTime() - postDate.getTime();
    if (time / 1000 < 1) {
      return "1s";
    } else if (time / 1000 < 60) {
      return `${Math.floor(time / 1000)}s`; //seconds
    } else if (time / 60000 < 60) {
      return `${Math.floor(time / 60000)}m`; //minutes
    } else if (time / 3600000 < 24) {
      return `${Math.floor(time / 3600000)}h`; //hours
    } else {
      return `${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`; //day
    }
  }

  // UseEffects
  useEffect(() => {
    if (accessToken) return;
    const handleInit = async () => {
      try {
        let token = accessToken;

        if (!token) {
          const res = await api.post(
            "/token/refresh/",
            {},
            { withCredentials: true },
          );
          token = res.data.access;
          setAccessToken(res.data.access);
        }

        const response = await api.get("/posts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        UsePosts(response.data.results);

        const actual_user_response = await api.get("/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActualUser(actual_user_response.data);
      } catch (err) {
        console.log(err);
        navigate("/signin");
      }
    };
    handleInit();
  }, [accessToken, setAccessToken, navigate, actualUser]);

  //functions
  const handlePost = async () => {
    const formData = new FormData();
    if (image) {
      formData.append("post_body", postMessage);
      formData.append("files", image);
    } else {
      formData.append("post_body", postMessage);
    }
    try {
      const response = await api.post("/posts/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setImage(null);
      setPreview(null);
      setPostMessage("");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const retweet = async (id: number) => {
  if (!actualUser) return;

  let previousPosts: PostProps[] = [];
    UsePosts((prevPosts) => {
      previousPosts = prevPosts;

      return prevPosts.map((post) => {
        if (post.id !== id) return post;

        const alreadyRetweeted = post.retweets.some(
          (rt) => rt.author === actualUser.id
        );

        return {
          ...post,
          retweets: alreadyRetweeted
            ? post.retweets.filter((rt) => rt.author !== actualUser.id)
            : [
                ...post.retweets,
                {
                  id: Date.now(),
                  author: actualUser.id,
                  post: id,
                  created_at: new Date().toISOString(),
                },
              ],
        };
      });
    });
    try {
      await api.post(
        `/posts/${id}/retweet/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      UsePosts(previousPosts);
      console.log(err);
    }
  };
  const like = async (id: number) => {
    if (!actualUser) return;

    let previousPosts: PostProps[] = [];

    UsePosts((prevPosts) => {
      previousPosts = prevPosts;

      return prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.likes.includes(actualUser.id)
                ? post.likes.filter((like) => like !== actualUser.id)
                : [...post.likes, actualUser.id],
            }
          : post
      );
    });

    try {
      const response = await api.post(
        `/posts/${id}/like_unlike_post/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      UsePosts(previousPosts);
      console.log(err);
    }
  };

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
        <div className="border-r border-stone-800 flex-1 max-w-[600px]">
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
            <div className="flex flex-col">
              <div className="flex">
                <img
                  src={actualUser?.profile_image}
                  alt="profile_picture"
                  className="rounded-full w-12 h-12 min-h-12 min-w-12 object-cover"
                />
                <textarea
                  placeholder="What's happening?"
                  className="no-scrollbar bg-transparent outline-none ml-4 text-[20px] w-full text-sm text-[#E7E9EA] placeholder-stone-500 resize-none border-b border-stone-800"
                  onChange={(s) => {
                    setPostMessage(s.target.value);
                    s.target.style.height = "auto";
                    s.target.style.height = s.target.scrollHeight + "px";
                  }}
                  onPaste={(e) => {
                    const items = e.clipboardData.items;

                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];

                      if (item.type.startsWith("image")) {
                        const file = item.getAsFile();

                        if (file) {
                          setImage(file);

                          const url = URL.createObjectURL(file);
                          setPreview(url);
                        }
                      }
                    }
                  }}
                  value={postMessage}
                />
              </div>
              {preview && (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-2 rounded-xl max-h-80 object-cover"
                  />
                  <div className="border-b border-stone-800 pb-4" />
                </>
              )}
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
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>
          {Posts.map(
            (
              post, // HERE HERE HERE HERE HERE HERE HERE HERE
            ) => {
              const isLiked = actualUser ? post.likes.includes(actualUser.id) : false
              const isRetweeted = actualUser ? post.retweets.some((rt) => rt.author === actualUser.id) : false;
              return (
              <div
                className="bg-black flex p-4 mr-2 border-b border-stone-800 w-[100%]"
                key={post.id}
              >
                <img
                  className="rounded-full w-[48px] h-[48px] cursor-pointer self-start"
                  src={post.author.profile_image}
                  alt="profile_picture"
                />
                <div className="flex flex-col ml-3">
                  <div className="flex items-center">
                    <h2 className="pr-1 text-[#E7E9EA] text-[16px] cursor-pointer">
                      {post.author.name}
                    </h2>
                    <h2 className="pr-1 text-stone-500 text-[16px]">
                      @{post.author.username}
                    </h2>
                    <h4 className="text-stone-500 text-[16px]">
                      {" "}
                      · {CalcTemp(post.created_at)}
                    </h4>
                  </div>

                  <h2 className="text-[#E7E9EA] text-[18px]">
                    {post.post_body}
                  </h2>
                  {post.medias &&
                    post.medias.map((media) => (
                      <img
                        className="w-full rounded-md block mt-4 mb-4 max-w-[400px] object-cover cursor-pointer"
                        src={media.file}
                        alt=""
                        key={media.id}
                      />
                    ))}

                  <div className="flex justify-center gap-32 mt-4 pr-16">
                    <div className="flex items-center group cursor-pointer">
                      <CommentIcon className="fill-stone-500 cursor-pointer group-hover:fill-blue-500 w-6 h-6 transition-colors duration-300" />
                      <h2 className="text-stone-500 ml-1 group-hover:text-blue-500 transition-colors duration-300">
                        {post.comments.length}
                      </h2>
                    </div>
                    
                    
                    <div className="flex items-center group cursor-pointer" onClick={() => retweet(post.id)}>
                      <RetweetIcon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isRetweeted
                        ? "fill-green-500"
                        : "fill-stone-500 group-hover:fill-green-500"
                      }`}
                      />
                      <h2
                        className={`ml-1 transition-colors duration-300 ${
                          isRetweeted ? "text-green-500" : "text-stone-500"
                        }`}
                      >
                        {post.retweets.length}
                      </h2>
                    </div>
                    
                    
                    <div className="flex items-center group cursor-pointer" onClick={() => like(post.id)}>
                      <LikeIcon
                        className={`w-6 h-6 transition-colors duration-300 ${
                          isLiked
                            ? "fill-red-600"
                            : "fill-stone-500 group-hover:fill-red-600"
                        }`}
                      />

                      <h2
                        className={`ml-1 transition-colors duration-300 ${
                          isLiked ? "text-red-600" : "text-stone-500"
                        }`}
                      >
                        {post.likes.length}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              )
            },
          )}
        </div>
          <CommentInPost />
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

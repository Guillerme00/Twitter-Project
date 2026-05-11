import axios from "axios";

import HomeIcon from "../assets/icons/home.svg?react";
import MeIcon from "../assets/icons/me.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";
import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";
import ArrowIcon from "../assets/icons/arrow.svg?react";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

import { CommentInPost } from "./comment";
import { useSelectedPostStore } from "../store/SelectedPostStore";

type commentProps = {
  liked: boolean;
  retweeted: boolean;
  post: {
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
      author: number;
      created_at: string;
      id: number;
      post: number;
    }[];
  };
};
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

export const PostPageComponent = ({
  liked,
  retweeted,
  post,
}: commentProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const SelectedPost = useSelectedPostStore((state) => state.selectedPost);
  const setSelectedPost = useSelectedPostStore(
    (state) => state.setSelectedPost,
  );

  const [actualUser, setActualUser] = useState<ActualUser | null>(null);
  const [isLiked, setIsLiked] = useState(liked);
  const [likeNumber, setLikeNumber] = useState(post.likes.length)
  const [retweetNumber, setRetweetNumber] = useState(post.retweets.length)
  const [isRetweeted, setIsRetweeted] = useState(retweeted);

  const like = async (id: number) => {
    if (!actualUser) return;
    try {
      await api.post(
        `/posts/${id}/like_unlike_post/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setIsLiked(!isLiked);
      likeNumberCounter()
    } catch (err) {
      console.log(err);
    }
  };

  const retweet = async (id: number) => {
    if (!actualUser) return;

    try {
      await api.post(
        `/posts/${id}/retweet/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setIsRetweeted(!isRetweeted);
      retweetNumberCounter()
    } catch (err) {
      console.log(err);
    }
  };

  const likeNumberCounter = () => {
    if (isLiked) {
      return (
        setLikeNumber((prev) => prev - 1)
      )
    } else {
      return (
        setLikeNumber((prev) => prev + 1)
      )
    }
  }

  const retweetNumberCounter = () => {
    if (isRetweeted) {
      return (
        setRetweetNumber((prev) => prev - 1)
      )
    } else {
      return (
        setRetweetNumber((prev) => prev + 1)
      )
    }
  }

  const CalcTemp = (created_at: string) => {
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

  useEffect(() => {
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
        const actual_user_response = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActualUser(actual_user_response.data);
      } catch (err) {
        console.log(err);
        navigate("/signin");
      }
    };

    handleInit();
  }, [accessToken, navigate, setAccessToken]);

  useEffect(() => {
    if (SelectedPost === null) {
      document.body.style.overflow = "auto";
    }
  }, [SelectedPost]);

  return (
    <div className="bg-black h-screen text-[#E7E9EA] flex justify-center overflow-hidden">
      <div className="flex w-full max-w-[1300px]">
        {/* Left Side */}
        <div className="w-[275px] px-2 border-r border-stone-800 sticky top-0 h-screen">
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
        <div className="border-r border-stone-800 flex-1 max-w-[700px] overflow-y-auto no-scrollbar flex flex-col">
          <div className="h-[36 px] w-full">
              <button className="ml-2 text-[20px] text-[#E7E9EA] cursor-pointer hover:bg-stone-900 p-2 rounded-full mb-4 pl-2 pr-2 flex items-center"><ArrowIcon className="mr-6 fill-[#E7E9EA] w-6 h-6"/> Home</button>
          </div>
          <div className="flex"> {/* Post Author */}
            <img
              className="ml-7 mr-3 rounded-full w-[48px] h-[48px] cursor-pointer self-start"
              src={post.author.profile_image}
              alt="profile_picture"
            />
            <div className="flex flex-col">
              <h2 className="pr-1 text-[#E7E9EA] text-[16px] cursor-pointer">
                {post.author.name}
              </h2>
              <h2 className="pr-1 text-stone-500 text-[16px]">
                @{post.author.username}
              </h2>
          </div>
          <h4 className="text-stone-500 text-[16px]"> · {CalcTemp(post.created_at)}</h4>
        </div>
        
        <div className="bg-black flex ml-7 mt-4" key={post.id}> {/* Post body */}
            <h2 className="text-[#E7E9EA] text-[18px]">{post.post_body}</h2>
          </div>

        <div className="flex flex-col pr-7 pl-7">
            {post.medias &&
              post.medias.map((media) => (
                <img
                  className="w-full rounded-md block mt-4 mb-4 object-cover cursor-pointer"
                  src={media.file}
                  alt=""
                  key={media.id}
                />
              ))}
            <div className="flex justify-center gap-32 mt-4">
              <div
                className="flex items-center group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPost(post);
                }}
              >
                <CommentIcon className="fill-stone-500 cursor-pointer group-hover:fill-blue-500 w-6 h-6 transition-colors duration-300" />
                <h2 className="text-stone-500 ml-1 group-hover:text-blue-500 transition-colors duration-300">
                  {post.comments.length}
                </h2>
              </div>

              <div
                className="flex items-center group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  retweet(post.id);
                }}
              >
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
                  {retweetNumber}
                </h2>
              </div>

              <div
                className="flex items-center group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  like(post.id);
                }}
              >
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
                  {likeNumber}
                </h2>
              </div>
            </div>
        </div>
      <div className="border-b border-stone-800 w-full mt-4"></div>
      </div>
      {actualUser && accessToken && SelectedPost ? (
        <CommentInPost
          post={SelectedPost}
          user={actualUser}
          token={accessToken}
        />
      ) : (
        false
      )}
        {/* right side */}
        <div className="w-[420px] px-4 sticky top-0 h-screen overflow-y-auto">
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
};

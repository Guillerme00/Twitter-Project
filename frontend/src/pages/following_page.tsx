import axios from "axios";
import HomeIcon from "../assets/icons/home_blank.svg?react";
import MeIcon from "../assets/icons/me_full.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";
import ArrowIcon from "../assets/icons/arrow.svg?react";

import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useEffect, useState } from "react";
import { FollowingFollowers } from "../components/following";

type miniUser = {
  id: number;
  username: string;
  name: string;
  profile_image: string;
  bio: string;
  is_following: boolean;
};

type actualUser = {
  bio: string;
  birthday: string;
  created_at: string;
  email: string;
  followers_count: number;
  following_count: number;
  id: number;
  is_following: boolean;
  name: string;
  profile_banner: string;
  profile_image: string;
  username: string;
  followers: miniUser[];
  following: miniUser[];
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

export const FollowingPage = () => {
  const { id } = useParams();

  const actualUser = useAuthStore((state) => state.user?.id);

  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [profileUser, setProfileUser] = useState<actualUser | null>(null);
  const [followings, setFollowing] = useState<miniUser | null>(null);

  const follow = () => {
    try {
      api.post(`users/${profileUser?.id}/follow/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const unfollow = () => {
    try {
      api.post(`users/${profileUser?.id}/unfollow/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

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
        const response = await api.get(`/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileUser(response.data);
        setFollowing(response.data.following[0]);
      } catch (err) {
        console.log(err);
      }
    };

    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-black h-screen text-[#E7E9EA] flex justify-center overflow-hidden">
      <div className="flex w-full max-w-[1300px]">
        {/* Left Side */}
        <div className="w-[275px] px-2 border-r border-stone-800 sticky top-0 h-screen">
          <div className="top-0 py-2 mr-8">
            <XIcon className="fill-[#E7E9EA] w-8 h-8 ml-3 mb-4 cursor-pointer" />
            <button
              className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300"
              onClick={() => navigate("/home")}
            >
              <HomeIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Home</h2>
            </button>
            <button
              className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300"
              onClick={() => navigate(`/profile/${actualUser}`)}
            >
              <MeIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Me</h2>
            </button>
            <button
              className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300"
              onClick={() => navigate("/settings")}
            >
              <SettingsIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Settings</h2>
            </button>
          </div>
        </div>

        {/* mid side */}
        <div className="flex-1 flex flex-col bg-black min-h-screen text-[#E7E9EA]">
          <div className="cursor-pointer flex items-center sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
            <ArrowIcon
              className="fill-[#E7E9EA] hover:bg-stone-800 h-10 w-10 transition-colors duration-300 p-2 rounded-full"
              onClick={() => navigate("/home")}
            />
            <div className="ml-2 p-2">
              <h1 className="font-bold text-[20px] leading-none">
                {profileUser?.name}
              </h1>
              <h2 className="text-[14px] mt-1 text-stone-500 leading-none">
                @{profileUser?.username}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b border-stone-800">
            <div className="p-4 cursor-pointer text-stone-500 font-bold text-center hover:bg-stone-900">
              Followers
            </div>
            <div className="p-4 cursor-pointer font-bold text-center hover:bg-stone-900">
              <div className="inline-block">
                Following
                <div className="h-1 bg-blue-400 rounded-full mt-1" />
              </div>
            </div>
          </div>
          <div>
            <FollowingFollowers
              bio={followings?.bio}
              is_following={followings?.is_following ?? false}
              name={followings?.name ?? ""}
              profile_image={followings?.profile_image}
              username={followings?.username ?? ""}
              id={followings?.id ?? -1}
              follow={follow}
              unfollow={unfollow}
            />
          </div>
        </div>
        {/* right side */}
        <div className="px-2 border-l border-stone-800 w-[420px] px-4 sticky top-0 h-screen overflow-y-auto">
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

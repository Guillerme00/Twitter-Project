import axios from "axios";
import BackIcon from "../assets/icons/arrow.svg?react";
import HomeIcon from "../assets/icons/home_blank.svg?react";
import MeIcon from "../assets/icons/me_full.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";

import { useNavigate, useSearchParams } from "react-router-dom";
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

export const SearchUserPage = () => {
  const [searchParams] = useSearchParams();
  
  const q = searchParams.get("q");
  const actualUser = useAuthStore((state) => state.user?.id);

  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [followings, setFollowing] = useState<miniUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchField, setSearchField] = useState("");

  const follow = async (userId: number) => {
  try {
    await api.post(
      `users/${userId}/follow/`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    setFollowing((prev) =>
      prev?.map((user) =>
        user.id === userId
          ? { ...user, is_following: true }
          : user
      ) ?? null
    );
  } catch (err) {
    console.log(err);
  }
};

const unfollow = async (userId: number) => {
  try {
    await api.post(
      `users/${userId}/unfollow/`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    setFollowing((prev) =>
      prev?.map((user) =>
        user.id === userId
          ? { ...user, is_following: false }
          : user
      ) ?? null
    );
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
        const response = await api.get(`/users/search_users/?q=${q}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setFollowing(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  return (
    <div className="bg-black h-screen text-[#E7E9EA] flex justify-center overflow-hidden"onClick={() => setSearching(false)}>
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
          <div className="border-b border-stone-800">
            <button
              className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300"
              onClick={() => navigate("/home")}>
              <BackIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Results for "{q}"</h2>
            </button>
          </div>
          <div>
            {
              followings?.map((following) => {
                return (
                  <FollowingFollowers
                    key={following.id}
                    bio={following.bio}
                    is_following={following.is_following ?? false}
                    name={following.name ?? ""}
                    profile_image={following.profile_image}
                    username={following.username ?? ""}
                    id={following.id ?? -1}
                    follow={follow}
                    unfollow={unfollow}
                    actual_user_id={actualUser}
                  />
                )
              })
            }
          </div>
        </div>
        {/* right side */}
        <div className="px-2 border-l border-stone-800 w-[420px] px-4 sticky top-0 h-screen overflow-y-auto">
          <div className="top-0 pt-2">
            <div className="bg-zinc-900 border border-stone-800 rounded-full px-4 py-2 focus-within:border-blue-500 relative">
              <input
              onClick={(e) => {
                  setSearching(true)
                  e.stopPropagation()
                }}
                onChange={(e) => setSearchField(e.target.value)}
                value={searchField}
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
              {
                searching &&
                <div className="p-2 flex flex-col absolute top-full bg-[#16181C] left-0 w-full flex rounded-xl shadow-[0_0_20px_4px_rgba(255,255,255,0.08)]">
                  <span className="p-1 font-bold hover:underline rounded-full cursor-pointer" onClick={() => navigate(`/users/search/?q=${searchField}`)}>Search "{searchField}" in Users</span>
                  <span className="p-1 font-bold hover:underline rounded-full cursor-pointer" onClick={() => navigate(`/posts/search/?q=${searchField}`)}>Search "{searchField}" in Posts</span>
                </div>
              }
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

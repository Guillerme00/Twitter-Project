
import HomeIcon from "../assets/icons/home.svg?react";
import MeIcon from "../assets/icons/me.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";
import ArrowIcon from "../assets/icons/arrow.svg?react";
import axios from "axios";

import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useEffect, useState } from "react";

type user = {
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

export const MeProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { id } = useParams()

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const [profileOwner, setProfileOwner] = useState<user | null>(null)

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
        const response = api.get(`/users/${id}/`, {
           headers: { Authorization: `Bearer ${token}` },
        }
      )
      setProfileOwner((await response).data)
      } catch (err) {
        console.log(err)
      }
    }

    handleInit()
  },[])

  return (
    <>
      <div className="bg-black h-screen text-[#E7E9EA] flex justify-center">
        <div className="flex w-full max-w-[1300px] overflow-hidden">
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
          <div className="w-full max-w-[600px] border-r border-stone-800 mt-2 relative text-[#E7E9EA]">
            <div className="cursor-pointer flex items-center sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
              <ArrowIcon className="fill-[#E7E9EA] hover:bg-stone-800 h-10 w-10 transition-colors duration-300 p-2 rounded-full"
              onClick={() => navigate("/home")}/>
              <div className="ml-2">
                <h1 className="font-bold text-[20px] leading-none">Name</h1>
                <h2 className="text-[14px] text-stone-500 leading-none">X posts</h2>
              </div>
            </div>
            <div className="relative">
              <img src={profileOwner?.profile_banner} alt="profile banner" className="w-full h-[250px]" />
              <img src={profileOwner?.profile_image} alt="profile image" className="w-28 h-28 rounded-full absolute bottom-4 left-8 border-black" />
            </div>
            <div className="flex justify-between items-center">
              <div className="ml-4 mt-4 flex flex-col gap-0">
                <h1 className="text-[28px] font-bold leading-none m-0 p-0">Name</h1>
                <span className="text-[20px] text-stone-500 leading-none m-0 p-0">@username</span>
              </div>
              <button className="rounded-full flex items-center justify-center border border-stone-500 font-bold px-4 py-2 cursor-pointer mr-4 hover:bg-stone-800 transition-colors duration-300">
                Edit Profile
              </button>
            </div>
          </div>




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
    </>
  );
};

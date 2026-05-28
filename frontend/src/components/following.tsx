import axios from "axios";

import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

type miniUser = {
  id: number;
  username: string;
  name: string;
  profile_image: string | undefined;
  bio: string | undefined;
  is_following: boolean;
  follow: (id: number) => void;
  unfollow: (id: number) => void;
  actual_user_id: number | undefined;
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

export const FollowingFollowers = ({
  bio,
  is_following,
  name,
  profile_image,
  username,
  id,
  follow,
  unfollow,
  actual_user_id
}: miniUser) => {
  const navigate = useNavigate()
  return (
    <div className="w-full flex p-4 border-b border-stone-800">
      <div className="cursor-pointer"
      onClick={() => navigate(`/profile/${id}`)}>
        <img
          className="rounded-full mr-4 w-[48px] h-[48px] cursor-pointer self-start"
          src={profile_image}
          alt="profile_picture"
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-[18px] mb-1 leading-none cursor-pointer hover:underline" onClick={() => navigate(`/profile/${id}`)}>
              {name}
            </span>
            <span className="text-stone-500 leading-none">@{username}</span>
          </div>
          { actual_user_id !== id &&
            <button
              className="rounded-full flex items-center justify-center border border-stone-500 font-bold px-4 py-2 cursor-pointer mr-4 hover:bg-stone-800 transition-colors duration-300"
              onClick={() => {
                if (is_following) {
                  unfollow(id);
                } else {
                  follow(id);
                }
              }}
            >
              {is_following ? "Unfollow" : "Follow"}
            </button>
          }
        </div>
        <h1 className="mt-4">{bio}</h1>
      </div>
    </div>
  );
};

import axios from "axios";

import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

import { useSelectedPostStore } from "../store/SelectedPostStore";

type commentProps = {
  post: PostType;
};

type PostType = {
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
  comments: PostType[];
  created_at: string;
  id: number;
  likes: number[];
  likes_count: number;
  parent_post: number | null;
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

export const CommentCard = ({ post }: commentProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const SelectedPost = useSelectedPostStore((state) => state.selectedPost);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const setSelectedPost = useSelectedPostStore(
    (state) => state.setSelectedPost,
  );

  const [actualUser, setActualUser] = useState<ActualUser | null>(null);

  const [likeNumber, setLikeNumber] = useState(post.likes.length);
  const [retweetNumber, setRetweetNumber] = useState(post.retweets.length);

  const [isLiked, setIsLiked] = useState(
    post.likes.includes(actualUser?.id ?? -1),
  );
  const [isRetweeted, setIsRetweeted] = useState(
    post.retweets.some((rt) => rt.author === actualUser?.id),
  );

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
      likeNumberCounter();
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
      retweetNumberCounter();
    } catch (err) {
      console.log(err);
    }
  };

  const likeNumberCounter = () => {
    if (isLiked) {
      return setLikeNumber((prev: number) => prev - 1);
    } else {
      return setLikeNumber((prev: number) => prev + 1);
    }
  };

  const retweetNumberCounter = () => {
    if (isRetweeted) {
      return setRetweetNumber((prev: number) => prev - 1);
    } else {
      return setRetweetNumber((prev: number) => prev + 1);
    }
  };

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
  }, [
    accessToken,
    actualUser,
    navigate,
    post.likes,
    post.retweets,
    setAccessToken,
  ]);

  useEffect(() => {
    if (SelectedPost === null) {
      document.body.style.overflow = "auto";
    }
  }, [SelectedPost]);
  return (
    <div
      className="bg-black flex p-4 mr-2 border-b border-stone-800 w-[100%] cursor-pointer"
      key={post.id}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <img
        className="rounded-full w-[48px] h-[48px] cursor-pointer self-start"
        src={post.author.profile_image}
        alt="profile_picture"
      />
      <div className="flex flex-col ml-3 w-full">
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

        <h2 className="text-[#E7E9EA] text-[18px]">{post.post_body}</h2>
        {post.medias &&
          post.medias.map((media) => (
            <img
              className="w-full rounded-md block mt-4 mb-4 max-w-[450px] object-cover cursor-pointer"
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
              {post.comments?.length ?? 0}
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
    </div>
  );
};

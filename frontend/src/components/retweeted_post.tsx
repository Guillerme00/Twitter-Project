import axios from "axios";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";

import { CommentInPost } from "../components/comment";
import { useSelectedPostStore } from "../store/SelectedPostStore";

import type { PostProps } from "../types/postType";

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

type retweetPost = {
    user: ActualUser
    post: PostProps
    Delete: (id: number) => void;
    Like: (id: number) => void;
    Retweet: (id: number) => void;
}

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

export const RetweetedPost = ({user, post, Delete, Like, Retweet}: retweetPost) => {
    //consts
      const accessToken = useAuthStore((state) => state.accessToken);
      const setAccessToken = useAuthStore((state) => state.setAccessToken);
      const navigate = useNavigate();
      const setSelectedPost = useSelectedPostStore(
        (state) => state.setSelectedPost,
      );
      const SelectedPost = useSelectedPostStore((state) => state.selectedPost);
    
      //states
      const [actualUser, setActualUser] = useState<ActualUser | null>(user);
      const [openedPostMenu, setOpenedPostMenu] = useState<number | null>(null);
    
      //functions
    
      const openClosePostMenu = (id: number) => {
        if (openedPostMenu !== null && openedPostMenu === id) {
          setOpenedPostMenu(null);
        } else if (openedPostMenu !== null || openedPostMenu !== id) {
          setOpenedPostMenu(id);
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
    
      // UseEffects
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
    
      //functions

    const isLiked = actualUser
        ? post.likes.includes(actualUser.id)
        : false;

    const isRetweeted = actualUser
        ? post.retweets.includes(actualUser.id)
        : false;

    if (post.parent_post === null) {
        return (
            <div
                className="bg-black flex pr-8 pb-4 pt-4 pl-2 mr-2 border-b border-stone-800 w-[100%] cursor-pointer relative"
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
            >
                {actualUser?.id === post.author.id && (
                    <button
                        className="font-white absolute h-8 w-8 flex items-center justify-center top-3 right-3 cursor-pointer hover:bg-stone-700 p-2 rounded-full transition-colors duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            openClosePostMenu(post.id);
                        }}
                    >
                        •••
                    </button>
                )}

                {openedPostMenu === post.id && (
                    <div className="absolute top-12 right-3 w-56 bg-black border border-stone-800 rounded-2xl shadow-xl z-50 transition-colors duration-300">
                        <h1
                            className="text-red-500 font-bold ml-4"
                            onClick={(e) => {
                                e.stopPropagation();
                                Delete(post.id);
                            }}
                        >
                            Delete post
                        </h1>
                    </div>
                )}

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
                            · {CalcTemp(post.created_at)}
                        </h4>
                    </div>

                    <h2 className="text-[#E7E9EA] text-[18px]">
                        {post.post_body}
                    </h2>

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
                                Retweet(post.id);
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
                                    isRetweeted
                                        ? "text-green-500"
                                        : "text-stone-500"
                                }`}
                            >
                                {post.retweets.length}
                            </h2>
                        </div>

                        <div
                            className="flex items-center group cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                Like(post.id);
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
                                    isLiked
                                        ? "text-red-600"
                                        : "text-stone-500"
                                }`}
                            >
                                {post.likes.length}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    {actualUser && accessToken && SelectedPost ? (
          <CommentInPost
            post={SelectedPost}
            user={actualUser}
            token={accessToken}
          />
        ) : (
          false
        )}

    return null;
};
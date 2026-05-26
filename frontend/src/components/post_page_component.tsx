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
import { useParams } from "react-router-dom";

import { CommentInPost } from "./comment";
import { useSelectedPostStore } from "../store/SelectedPostStore";
import { CommentCard } from "./CommentCard";

import type { PostProps } from "../types/postType";

type commentProps = {
  liked: boolean;
  retweeted: boolean;
  post: PostProps;
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
  birthday: string;
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

export const PostPageComponent = ({ liked, retweeted, post }: commentProps) => {
  const { id } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const SelectedPost = useSelectedPostStore((state) => state.selectedPost);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const setSelectedPost = useSelectedPostStore(
    (state) => state.setSelectedPost,
  );

  const [actualUser, setActualUser] = useState<ActualUser | null>(null);
  const [isLiked, setIsLiked] = useState(liked);
  const [isRetweeted, setIsRetweeted] = useState(retweeted);

  const [postComments, setPostComments] = useState<PostProps["comments"]>(
    post.comments,
  );

  const [likeNumber, setLikeNumber] = useState(post.likes.length);
  const [retweetNumber, setRetweetNumber] = useState(post.retweets.length);

  const [postComment, setpostComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const validPost = postComment.length >= 1 && postComment.length <= 500;

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
      return setLikeNumber((prev) => prev - 1);
    } else {
      return setLikeNumber((prev) => prev + 1);
    }
  };

  const retweetNumberCounter = () => {
    if (isRetweeted) {
      return setRetweetNumber((prev) => prev - 1);
    } else {
      return setRetweetNumber((prev) => prev + 1);
    }
  };

  const handleDeleteComment = (id: number) => {
    setPostComments((prev) => prev?.filter((c) => c.id !== id));
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
  }, [accessToken, navigate, setAccessToken, post]);

  const handlePostComment = () => {
    const handlePostCommentFunc = async () => {
      const formData = new FormData();
      if (image) {
        formData.append("post_body", postComment);
        formData.append("files", image);
      } else {
        formData.append("post_body", postComment);
      }
      try {
        await api.post(`/posts/${post.id}/comment/`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const response = await api.get(`/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setPostComments(response.data.comments);
        setpostComment("");
        setSelectedPost(null);
        navigate(`/post/${post.id}`);
      } catch (err) {
        console.log(err);
      }
    };
    handlePostCommentFunc();
  };

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
            <button
              className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300"
              onClick={() => navigate("/home")}
            >
              <HomeIcon className="fill-[#E7E9EA] w-8 h-8" />
              <h2 className="text-xl">Home</h2>
            </button>
            <button
              className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-5 rounded-full transition-colors duration-300"
              onClick={() => navigate(`/profile/${actualUser?.id}`)}
            >
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
          <div className="h-[36 px] w-full mt-2">
            <button
              className="ml-2 text-[20px] text-[#E7E9EA] cursor-pointer hover:bg-stone-900 p-2 rounded-full mb-4 pl-2 pr-2 flex items-center"
              onClick={() => navigate("/home")}
            >
              <ArrowIcon className="mr-6 fill-[#E7E9EA] w-6 h-6" /> Home
            </button>
          </div>
          <div className="flex">
            {" "}
            {/* Post Author */}
            <img
              className="ml-7 mr-3 rounded-full w-[48px] h-[48px] cursor-pointer self-start"
              src={post.author.profile_image}
              alt="profile_picture"
              onClick={() => navigate(`/profile/${post.author.id}`)}
            />
            <div className="flex flex-col">
              <h2 className="pr-1 text-[#E7E9EA] text-[16px] cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${post.author.id}`)}
              >
                {post.author.name}
              </h2>
              <h2 className="pr-1 text-stone-500 text-[16px]">
                @{post.author.username}
              </h2>
            </div>
            <h4 className="text-stone-500 text-[16px]">
              {" "}
              · {CalcTemp(post.created_at)}
            </h4>
          </div>

          <div className="bg-black flex ml-7 mt-4" key={post.id}>
            <h2 className="text-[#E7E9EA] text-[18px]">{post.post_body}</h2>
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

            <div className="flex justify-center gap-32 mt-4 border-b border-stone-800">
              <div
                className="flex items-center group cursor-pointer mb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPost(post);
                }}
              >
                <CommentIcon className="fill-stone-500 cursor-pointer group-hover:fill-blue-500 w-6 h-6 transition-colors duration-300" />
                <h2 className="text-stone-500 ml-1 group-hover:text-blue-500 transition-colors duration-300">
                  {post.comments?.length}
                </h2>
              </div>

              <div
                className="flex items-center group cursor-pointer mb-4"
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
                className="flex items-center group cursor-pointer mb-4"
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
            <div>
              <div className="flex flex-col p-4 border-b border-stone-800">
                <div className="flex flex-col">
                  <div>
                    <div className="flex">
                      <img
                        src={actualUser?.profile_image}
                        alt="profile_picture"
                        className="rounded-full w-12 h-12 min-h-12 min-w-12 object-cover"
                      />
                      <textarea
                        placeholder="Post your reply"
                        className="no-scrollbar bg-transparent outline-none ml-4 text-[20px] w-full text-sm text-[#E7E9EA] placeholder-stone-500 resize-none"
                        onChange={(s) => {
                          setpostComment(s.target.value);
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
                        value={postComment}
                      />
                    </div>
                  </div>
                  {preview && (
                    <>
                      <img
                        src={preview}
                        alt="preview"
                        className="mt-2 rounded-xl "
                      />
                      <div className="border-b border-stone-800 pb-4" />
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className={`hover:bg-stone-300 w-24 h-8 p-1 pr-2 pl-2 text-bold flex items-center justify-center rounded-full font-bold cursor-pointer text-[16px] bg-[#E7E9EA] text-stone-900 transition-colors duration-300
                ${
                  validPost
                    ? "bg-[#E7E9EA] text-black hover:bg-[#cfcfcf] cursor-pointer"
                    : "bg-stone-700 text-black opacity-50 cursor-not-allowed"
                }
                `}
                  onClick={handlePostComment}
                >
                  Reply
                </button>{" "}
                {/*reply button */}
              </div>
            </div>
          </div>
          <div className="w-full mt-4 border-b border-stone-800"></div>
          {postComments?.map(
            (
              post_comment, // HERE HERE HERE HERE HERE HERE HERE HERE
            ) => (
              <CommentCard
                post={post_comment}
                onDelete={handleDeleteComment}
                key={post_comment.id}
              />
            ),
          )}
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
  );
};

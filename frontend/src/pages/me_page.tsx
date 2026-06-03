import HomeIcon from "../assets/icons/home_blank.svg?react";
import MeIcon from "../assets/icons/me_full.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";
import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";
import ArrowIcon from "../assets/icons/arrow.svg?react";
import DateIcon from "../assets/icons/date.svg?react";
import BornIcon from "../assets/icons/born.svg?react";
import { api } from "../services/api";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useEffect, useState } from "react";

import type { PostProps } from "../types/postType";
import { useSelectedPostStore } from "../store/SelectedPostStore";
import { CommentInPost } from "../components/comment";
import { EditProfile } from "../components/edit_profile";

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
  created_at: string;
  is_following: boolean;
};

export const MeProfile = () => {
  const { id } = useParams();
  const months: Record<number, string> = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const actualUserId = useAuthStore((state) => state.user?.id);
  const SelectedPost = useSelectedPostStore((state) => state.selectedPost);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSelectedPost = useSelectedPostStore(
    (state) => state.setSelectedPost,
  );
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const [profileOwner, setProfileOwner] = useState<user | null>(null);
  const [userPosts, setUserPosts] = useState<PostProps[] | null>(null);
  const [actualUser, setActualUser] = useState<user | null>(null);
  const [openedPostMenu, setOpenedPostMenu] = useState<number | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [edited, setEdited] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileBanner, setProfileBanner] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [following, setFollowing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchField, setSearchField] = useState("");

  const isProfileOwner = profileOwner?.id === actualUserId;

  const handleSaveProfile = () => {
    try {
      setEdited((prev) => !prev);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);

      if (profileBannerFile) {
        formData.append("profile_banner", profileBannerFile);
      }
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }
      api.patch(`users/${profileOwner?.id}/`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEditProfile((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const follow = () => {
    try {
      api.post(`users/${profileOwner?.id}/follow/`,{}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const unfollow = () => {
    try {
      api.post(`users/${profileOwner?.id}/unfollow/`,{}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const toggleEditProfile = () => {
    setName(profileOwner?.name ?? "");
    setBio(profileOwner?.bio ?? "");
    setProfileBanner(profileOwner?.profile_banner ?? "");
    setProfileImage(profileOwner?.profile_image ?? "");
    setEditProfile((prev) => !prev);
  };

  const openClosePostMenu = (id: number) => {
    if (openedPostMenu !== null && openedPostMenu === id) {
      setOpenedPostMenu(null);
    } else if (openedPostMenu !== null || openedPostMenu !== id) {
      setOpenedPostMenu(id);
    }
  };

  const FormatDate = (date: string | undefined) => {
    if (date) {
      const [year, month, day] = date.split("-").map(Number);
      return `Born ${months[month]} ${day}, ${year}`;
    }
    return "Erro";
  };

  const formCreatedDate = (date: string | undefined) => {
    if (date) {
      const [year, month] = date.split("-").map(Number);
      return `Joined ${months[month]} ${year}`;
    }
  };

  const deletePost = async (id: number) => {
    setUserPosts(
      (prevPosts) => prevPosts?.filter((post) => post.id !== id) ?? null,
    );
    try {
      await api.delete(`/posts/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const retweet = async (id: number, isRetweetPost: boolean) => {
    if (!actualUser) return;

    let previousPosts: PostProps[] = [];

    setUserPosts((prevPosts) => {
      previousPosts = prevPosts ?? [];

      return (prevPosts ?? [])
        .map((post) => {
          if (isRetweetPost) {
            if (post.retweet_post?.id !== id) return post;

            const alreadyRetweeted = post.retweet_post.retweets.includes(
              actualUser.id,
            );

            return {
              ...post,
              retweet_post: {
                ...post.retweet_post,
                retweets: alreadyRetweeted
                  ? post.retweet_post.retweets.filter(
                      (uid) => uid !== actualUser.id,
                    )
                  : [...post.retweet_post.retweets, actualUser.id],
              },
            };
          } else {
            if (post.id !== id) return post;

            const alreadyRetweeted = post.retweets.includes(actualUser.id);

            return {
              ...post,
              retweets: alreadyRetweeted
                ? post.retweets.filter((uid) => uid !== actualUser.id)
                : [...post.retweets, actualUser.id],
            };
          }
        })
        .filter((post): post is PostProps => post !== null);
    });

    try {
      await api.post(
        `/posts/${id}/retweet/`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (err) {
      setUserPosts(previousPosts);
      console.log(err);
    }
  };

  const like = async (id: number, isRetweetPost: boolean) => {
    if (!actualUser) return;

    let previousPosts: PostProps[] = [];

    setUserPosts((prevPosts) => {
      previousPosts = prevPosts ?? [];

      return (prevPosts ?? []).map((post) => {
        if (isRetweetPost) {
          if (post.retweet_post?.id !== id) return post;

          const alreadyLiked = post.retweet_post.likes.includes(actualUser.id);

          return {
            ...post,
            retweet_post: {
              ...post.retweet_post,
              likes: alreadyLiked
                ? post.retweet_post.likes.filter((uid) => uid !== actualUser.id)
                : [...post.retweet_post.likes, actualUser.id],
            },
          };
        } else {
          if (post.id !== id) return post;

          const alreadyLiked = post.likes.includes(actualUser.id);

          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter((uid) => uid !== actualUser.id)
              : [...post.likes, actualUser.id],
          };
        }
      });
    });

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
    } catch (err) {
      setUserPosts(previousPosts);
      console.log(err);
    }
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `https://twitter-project-production.up.railway.app${url}`;
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
        const response = await api.get(`/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(response.data.is_following);
        setProfileOwner(response.data);

        const response2 = await api.get(`/users/${id}/user_posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const actual_user_response = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActualUser(actual_user_response.data);

        setUserPosts(response2.data);
      } catch (err) {
        console.log(err);
      }
    };

    handleInit();
  }, [id, accessToken, setAccessToken, edited]);

  return (
    <>
      <div className="bg-black h-screen text-[#E7E9EA] flex justify-center"onClick={() => setSearching(false)}>
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
          <div className="w-full max-w-[600px] border-r border-stone-800 mt-2 relative text-[#E7E9EA] h-screen overflow-y-auto no-scrollbar">
            <div className="cursor-pointer flex items-center sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
              <ArrowIcon
                className="fill-[#E7E9EA] hover:bg-stone-800 h-10 w-10 transition-colors duration-300 p-2 rounded-full"
                onClick={() => navigate("/home")}
              />
              <div className="ml-2">
                <h1 className="font-bold text-[20px] leading-none">
                  {profileOwner?.name}
                </h1>
                <h2 className="text-[14px] text-stone-500 leading-none">
                  {userPosts?.length} post(s)
                </h2>
              </div>
            </div>
            <div className="relative">
              <img
                src={profileOwner?.profile_banner}
                alt="profile banner"
                className="w-full h-[320px]"
              />
              <img
                src={profileOwner?.profile_image}
                alt="profile image"
                className="w-28 h-28 rounded-full absolute bottom-4 left-8 border-black/35 border-[4px]"
              />
            </div>
            <div className="flex justify-between items-center pt-8">
              <div className="ml-4 mt-2 flex flex-col gap-0">
                <h1 className="text-[28px] font-bold leading-none m-0 p-0">
                  {profileOwner?.name}
                </h1>
                <span className="text-[20px] text-stone-500 leading-none m-0 p-0">
                  @{profileOwner?.username}
                </span>
                <span className="mt-3 font-[#E7E9EA] text-[20px]">
                  {profileOwner?.bio}
                </span>
              </div>
              {isProfileOwner && (
                <button
                  className="rounded-full flex items-center justify-center border border-stone-500 font-bold px-4 py-2 cursor-pointer mr-4 hover:bg-stone-800 transition-colors duration-300"
                  onClick={() => toggleEditProfile()}
                >
                  Edit Profile
                </button>
              )}
              {!isProfileOwner && (
                <button
                  className="rounded-full flex items-center justify-center border border-stone-500 font-bold px-4 py-2 cursor-pointer mr-4 hover:bg-stone-800 transition-colors duration-300"
                  onClick={() => {
                    if (following) {
                      unfollow();
                    } else {
                      follow();
                    }
                  }}
                >
                  {following ? "Unfollow" : "Follow"}
                </button>
              )}
              {editProfile && (
                <EditProfile
                  toggleEditProfile={toggleEditProfile}
                  handleSaveProfile={handleSaveProfile}
                  bio={bio}
                  name={name}
                  profile_banner={profileBanner}
                  profile_image={profileImage}
                  setBio={setBio}
                  setName={setName}
                  setProfileBanner={setProfileBanner}
                  setProfileImage={setProfileImage}
                  setProfileBannerFile={setProfileBannerFile}
                  setProfileImageFile={setProfileImageFile}
                />
              )}
            </div>
            <div className="flex justify-between pb-4 ml-4 mr-4 mt-4 text-stone-500">
              <div className="flex items-center cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${id}/followers`)}
              >
                <span className="text-[#E7E9EA] mr-1">
                  {profileOwner?.followers_count}
                </span>
                <span>Followers</span>
              </div>
              <div className="flex items-center cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${id}/following`)}
              >
                <span className="text-[#E7E9EA] mr-1">
                  {profileOwner?.following_count}
                </span>
                <span>Following</span>
              </div>
              <div className="flex items-center">
                <BornIcon className="fill-stone-500 h-5 w-5" />
                <span>{FormatDate(profileOwner?.birthday)}</span>
              </div>
              <div className="flex items-center">
                <DateIcon className="fill-stone-500 h-5 w-5" />
                <span>{formCreatedDate(profileOwner?.created_at)}</span>
              </div>
            </div>
            <div className="border-t border-stone-800">
              {userPosts?.map(
                (
                  post, // HERE HERE HERE HERE HERE HERE HERE HERE
                ) => {
                  if (post.parent_post === null && post.retweet_post === null) {
                    const isLiked = actualUser
                      ? post.likes.includes(actualUser.id)
                      : false;
                    const isRetweeted = actualUser
                      ? post.retweets.includes(actualUser.id)
                      : false;
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
                                deletePost(post.id);
                              }}
                            >
                              Delete post
                            </h1>
                          </div>
                        )}
                        <img
                          className="rounded-full w-[48px] h-[48px] cursor-pointer self-start"
                          src={getImageUrl(profileOwner?.profile_image || "")}
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

                          <h2 className="text-[#E7E9EA] text-[18px]">
                            {post.post_body}
                          </h2>
                          {post.medias &&
                            post.medias.map((media) => (
                              <img
                                className="w-full rounded-md block mt-4 mb-4 object-cover cursor-pointer"
                                src={getImageUrl(media.file || "")}
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
                                {post.comments?.length}
                              </h2>
                            </div>

                            <div
                              className="flex items-center group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                retweet(post.id, false);
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
                                like(post.id, false);
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
                                {post.likes.length}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (
                    post.retweet_post !== null &&
                    post.retweet_post !== undefined &&
                    post.parent_post === null
                  ) {
                    const isLiked = actualUser
                      ? post.retweet_post?.likes.includes(actualUser.id)
                      : false;
                    const isRetweeted = actualUser
                      ? post.retweet_post?.retweets.includes(actualUser.id)
                      : false;
                    return (
                      <div
                        className="bg-black flex pr-8 pb-4 pt-4 pl-2 mr-2 border-b border-stone-800 w-[100%] cursor-pointer relative"
                        key={post.id}
                        onClick={() =>
                          navigate(`/post/${post.retweet_post?.id}`)
                        }
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
                                deletePost(post.id);
                              }}
                            >
                              Delete post
                            </h1>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="flex fill-stone-500 text-stone-500 cursor-pointer mb-2 hover:underline items-center">
                            <RetweetIcon className="fill-stone-500 w-4 h-4 mr-1" />
                            <h1>Retweeted by @{post.author.username}</h1>
                          </div>
                          <div className="flex pl-4">
                            <img
                              className="rounded-full w-[48px] h-[48px] cursor-pointer self-start"
                              src={getImageUrl(
                                post.retweet_post?.author?.profile_image || "",
                              )}
                              alt="profile_picture"
                            />

                            <div className="flex flex-col ml-3 w-full">
                              <div className="flex items-center">
                                <h2 className="pr-1 text-[#E7E9EA] text-[16px] cursor-pointer">
                                  {post.retweet_post?.author.name}
                                </h2>

                                <h2 className="pr-1 text-stone-500 text-[16px]">
                                  @{post.retweet_post?.author.username}
                                </h2>

                                <h4 className="text-stone-500 text-[16px]">
                                  · {CalcTemp(post.retweet_post?.created_at)}
                                </h4>
                              </div>

                              <h2 className="text-[#E7E9EA] text-[18px]">
                                {post.retweet_post?.post_body}
                              </h2>

                              {post.retweet_post?.medias &&
                                post.retweet_post?.medias.map((media) => (
                                  <img
                                    className="w-full rounded-md block mt-4 mb-4 object-cover cursor-pointer"
                                    src={getImageUrl(media.file || "")}
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
                                    {post.retweet_post?.comments?.length ?? 0}
                                  </h2>
                                </div>

                                <div
                                  className="flex items-center group cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    retweet(
                                      post.retweet_post?.id ?? post.id,
                                      true,
                                    );
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
                                    {post.retweet_post?.retweets.length ?? 0}
                                  </h2>
                                </div>

                                <div
                                  className="flex items-center group cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    like(
                                      post.retweet_post?.id ?? post.id,
                                      true,
                                    );
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
                                    {post.retweet_post?.likes.length ??
                                      post.likes.length}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                },
              )}
              {actualUser && accessToken && SelectedPost ? (
                <CommentInPost
                  post={SelectedPost}
                  user={actualUser.id}
                  token={accessToken}
                />
              ) : (
                false
              )}
            </div>
          </div>

          {/* right side */}
          <div className="w-[420px] px-4 sticky top-0 h-screen overflow-y-auto">
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
    </>
  );
};

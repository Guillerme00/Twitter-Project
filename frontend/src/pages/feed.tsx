import { useEffect, useState } from "react";
import { Post } from "../components/post";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

import HomeIcon from "../assets/icons/home.svg?react";
import MeIcon from "../assets/icons/me.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import XIcon from "../assets/icons/x_logo.svg?react";

type PostProps = {
  id: number;
  name: string;
  username: string;
  profileImage: string;
  content: string;
  postImage?: string;
  comments: number;
  likes: number;
  retweets: number;
  created_at: string;
};

export function Feed() {
  //states
  // const [Posts, UsePosts] = useState<PostProps[]>([]);

  //consts
  // const token = useAuthStore((state) => state.accessToken);

  // UseEffects
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get("http://127.0.0.1:8000/api/posts/", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //        console.log(response.data.results);
  //       UsePosts(response.data.results);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  // Body
  return (
    <div className="bg-black min-h-screen text-white flex justify-center">
      <div className="flex w-full max-w-[1200px]">
        <div className="w-[275px] px-2 border-r border-stone-800">
          <div className="top-0 py-2 mr-8">
            <XIcon className="fill-white w-10 h-10 ml-3" />
            <button className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-3 rounded-full">
              <HomeIcon className="fill-white w-10 h-10" />
              <h2 className="text-xl">Home</h2>
            </button>
            <button className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-3 rounded-full">
              <MeIcon className="fill-white w-10 h-10" />
              <h2 className="text-xl">Me</h2>
            </button>
            <button className="hover:bg-stone-800 cursor-pointer p-3 flex items-center gap-3 rounded-full">
              <SettingsIcon className="fill-white w-10 h-10" />
              <h2 className="text-xl">Settings</h2>
            </button>
          </div>
        </div>
        <div className="border-r border-stone-800">
          <div className="flex p-4 border-b border-stone-800">
            <div className="flex">
              <img src="https://placehold.co/64x64" alt="profile_picture" className="rounded-full"/>
              <input
                  type="text"
                  placeholder="What's happening?"
                  className="bg-transparent outline-none ml-4 text-[24px] w-full text-sm text-white placeholder-stone-500"
                />
            </div>
          </div>
          <Post
            key={1}
            name="Guilherme Toledo"
            username="guillerme007"
            profileImage="https://placehold.co/64x64"
            comments={0}
            likes={0}
            retweets={0}
            content="Hello World"
            postImage="https://placehold.co/1000x600"
            created_at="01-01-2026"
          />
        </div>

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

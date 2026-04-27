import { useEffect, useState } from "react";
import { Post } from "../components/post";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

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
    <div className="bg-black min-h-screen flex justify-center">
      <div className="text-white border-r-[0.5px] border-stone-500">n1n1n1n1n1n1n1n1</div>
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
      <div className="text-white border-l-[0.5px] border-stone-500">n33nn3n3nn3n3nn3n3n</div>
    </div>
  );
}

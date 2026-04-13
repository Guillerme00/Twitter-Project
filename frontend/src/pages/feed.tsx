import { useEffect, useState } from "react";
import { Post } from "../components/post";
import axios from "axios";

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
    const [Posts, UsePosts] = useState<PostProps[]>([])
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/posts/");
                UsePosts(response.data.results)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }, [])
    return (
        <div>
            {Posts.map((post) => (
                <Post key={post.id} name={post.name} username={post.username} profileImage={post.profileImage} comments={post.comments} likes={post.likes} retweets={post.retweets} content={post.content} postImage={post.postImage} created_at={post.created_at} />
            ))}
        </div>
    )
}
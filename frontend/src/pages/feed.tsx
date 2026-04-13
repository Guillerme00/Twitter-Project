import { Post } from "../components/post";

type PostProps = {
  name: string;
  username: string;
  profileImage: string;
  content: strinsg;
  postImage?: string;
  comments: number;
  likes: number;
  retweets: number;
  created_at: string;
};



export function Feed() {
    return (
        <div>
            <Post />
        </div>
    )
}
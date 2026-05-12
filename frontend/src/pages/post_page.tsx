import axios from "axios";
import { PageNotFound } from "../components/page_not_found";
import { PostPageComponent } from "../components/post_page_component";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useEffect, useState } from "react";

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
  comments: [];
  created_at: string;
  id: number;
  likes: number[];
  likes_count: number;
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

export function PostPage() {
  // consts
  const { id } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // States
  const [exist, setExist] = useState("untouched");
  const [post, setPost] = useState<PostType | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
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

        const headers = { Authorization: `Bearer ${token}` };

        const [postRes, meRes] = await Promise.all([
          api.get(`/posts/${id}/`, { headers }),
          api.get(`/users/me/`, { headers }),
        ]);

        setPost(postRes.data);
        setExist("found");
        setIsLiked(postRes.data.likes.includes(meRes.data.id));
        setIsRetweeted(
          postRes.data.retweets.some(
            (rt: { author: number }) => rt.author === meRes.data.id,
          ),
        );
      } catch (err) {
        console.log(err);
        setExist("notfound");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-black h-screen">
      {loading ? (
        false
      ) : exist === "notfound" || post == null ? (
        <PageNotFound />
      ) : (
        <PostPageComponent
          post={post}
          liked={isLiked}
          retweeted={isRetweeted}
        />
      )}
    </div>
  );
}

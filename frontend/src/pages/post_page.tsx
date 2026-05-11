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

  //states
  const [isliked, setLiked] = useState(false);

  //funcions
  const isLiked = async () => {
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
      const response = await api.get(`/posts/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const me = await api.get(`/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      for (const like_id of response.data.likes) {
        if (me.data.id === like_id) {
          setLiked(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // States
  const [exist, setExist] = useState("untouched");
  const [post, setPost] = useState<PostType | null>(null);

  // useEffects
  useEffect(() => {
    const postExist = async () => {
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

        const response = await api.get(`/posts/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data);
        setExist("found");
      } catch (err) {
        console.log(err);
        setExist("notfound");
      }
    };
    postExist();
    isLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {exist === "notfound" || post == null ? (
        <PageNotFound />
      ) : exist === "found" ? (
        <PostPageComponent post={post} liked={isliked} />
      ) : (
        false
      )}
    </>
  );
}

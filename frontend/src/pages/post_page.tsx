import axios from "axios";
import { PageNotFound } from "../components/page_not_found";
import { PostPageComponent } from "../components/post_page";
import { useParams  } from "react-router-dom";
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

export function PostPage () {
    // consts
    const { id } = useParams();
    const accessToken = useAuthStore((state) => state.accessToken)
    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    // States
    const [exist, setExist] = useState("untouched")

    // useEffects
    useEffect(() => {
        const postExist = async () => {
            try {
                let token = accessToken;

            if (!token) {
                const res = await api.post("/token/refresh/", {}, { withCredentials: true });
                token = res.data.access;
                setAccessToken(res.data.access);
            }

                await api.get(
                `/posts/${id}/`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setExist("found")
            } catch (err) {
                console.log(err)
                setExist("notfound")
            }
        }
        postExist()
    }, [])

    return (
        <>
            {exist === "notfound" ?
                <PageNotFound />
                : exist === "found" ?
                <PostPageComponent />
                : false
            }
        </>
    )
}
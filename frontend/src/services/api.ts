import axios from "axios"
import { useAuthStore } from "../store/AuthStore";

export const api = axios.create({
    baseURL: "https://twitter-project-production.up.railway.app/api",
    withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { setAccessToken } = useAuthStore.getState();
        const res = await axios.post(
          "https://twitter-project-production.up.railway.app/api/token/refresh/",
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
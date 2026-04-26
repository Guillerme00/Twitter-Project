import { useState } from "react";
import XIcon from "../assets/icons/x_logo.svg?react";
import axios, { type AxiosResponse } from "axios";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

export function Login() {
  //types
  type loginData = {
    username: string;
    password: string;
  };

  type TokenResponse = {
    access: string;
    refresh: string;
  };
  type UserData = {
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

  //states
  const [username, setUsername] = useState("");
  const [pass1, setPass1] = useState("");
  const [inError, setInError] = useState("untouched");
  const [seconds, setSeconds] = useState(3);
  const navigate = useNavigate();

  //functions
  const sleep = (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  async function redirecting(): Promise<undefined> {
    let current = seconds;

    while (current !== 0) {
      await sleep();
      current--;
      setSeconds(current);
    }
    navigate("/home");
    return;
  }

  const login = useAuthStore((state) => state.login);

  const goToSignUp = (): void | Promise<void> => {
    return navigate("/signup");
  };

  const post_login = async (
    UserData: loginData,
  ): Promise<AxiosResponse<TokenResponse>> => {
    const response = await axios.post<TokenResponse>(
      "http://localhost:8000/api/token/",
      UserData,
    );
    return response;
  };

  const set_pass1 = (password: string): void => {
    setPass1(password);
  };

  const handleSubmit = async () => {
    const user = {
      username: username,
      password: pass1,
    };
    try {
      const response = await post_login(user);
      const userInfos = await axios.get<UserData>(
        "http://localhost:8000/api/users/me/",
        {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        },
      );
      login(
        {
          id: userInfos.data.id,
          username: username,
        },
        response.data.access,
      );
      setInError("ok");
      redirecting();
    } catch (error) {
      console.log(error);
      setInError("erro");
    }
  };

  //body
  return (
    <div className="flex flex-col items-center pt-[64px]">
      <XIcon className="fill-white" />
      <div className="w-full max-w-[550px] flex flex-col items-center">
        <form className="flex flex-col items-center w-full mt-4">
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
            autoComplete="username"
            type="text"
            name="username"
            placeholder="Username"
            className="text-white placeholder-stone-700 p-4 mt-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />

          <input
            value={pass1}
            onChange={(e) => {
              set_pass1(e.target.value);
            }}
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="text-white placeholder-stone-700 p-4 mt-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />
          {inError === "erro" && (
            <h1 className="text-red-500">
              Error, username or password is wrong
            </h1>
          )}
          {inError === "ok" && (
            <h1 className="text-green-500">Logged, redirecting in {seconds}</h1>
          )}
        </form>
        <button
          onClick={handleSubmit}
          className="text-black mt-4 font-bold text-[20px] cursor-pointer p-4 bg-white rounded-4xl w-full"
        >
          Continue
        </button>
        <p className="text-stone-500 mt-4">
          Don't have an account?{" "}
          <button
            onClick={goToSignUp}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

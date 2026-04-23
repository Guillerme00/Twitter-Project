import { useState } from "react";
import XIcon from "../assets/icons/x_logo.svg?react";
import axios from "axios";

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


  //states
  const [username, setUsername] = useState("");
  const [pass1, setPass1] = useState("");

  //functions
  const post_login = async (UserData: loginData): Promise<TokenResponse> => {
    const response = await axios.post<TokenResponse>(
      "http://localhost:8000/api/token/",
      UserData,
    );
    return response.data;
  };

  const set_pass1 = (password: string): void => {
    setPass1(password);
  };

  const handleSubmit = async () => {
    const user = {
      "username": username,
      "password": pass1
    }
    const response = post_login(user)
    console.log(response)
    return response
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
              setUsername(e.target.value)
            }}
            required
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
          </form>
        <button
          onClick={handleSubmit}
          className="text-black mt-4 font-bold text-[20px] cursor-pointer p-4 bg-white rounded-4xl w-full"
        >
          Continue
        </button>
        <p className="text-stone-500 mt-4">
          Don't have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
          Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

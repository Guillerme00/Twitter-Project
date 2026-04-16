import { useState } from "react";
import XIcon from "../assets/icons/x_logo.svg?react";
import axios from "axios";

export function Register() {
  //types
  type RegisterData = {
    name: string;
    email: string;
    username: string;
    password: string;
    birthday: string;
  };

  //conts
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  //functions
  const post_register = async (UserData: RegisterData): Promise<number> => {
    const response = await axios.post(
      "http://localhost:8000/api/users/",
      UserData,
    );
    return response.status;
  };

  const password_match = pass1 === pass2;

  const password_isvalid = pass1.length >= 8 && pass1.length <= 20;

  const set_pass1 = (password: string): void => {
    setPass1(password);
  };

  const set_pass2 = (password: string): void => {
    setPass2(password);
  };

  const handleSubmit = async () => {
    if (!password_match || !password_isvalid) return;
    const birthday = `${year}-${months.indexOf(month) + 1}-${day}`;
    const UserDate = { name, email, username, password: pass1, birthday };
    const response = await post_register(UserDate);
    console.log(response);
    return response;
  };

  //body
  return (
    <div className="flex flex-col items-center pt-[64px]">
      <XIcon className="fill-white" />
      <div className="w-full max-w-[550px]">
        <form className="flex flex-col items-center w-full mt-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
            name="name"
            placeholder="Full Name"
            className="text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            name="email"
            placeholder="E-mail"
            className="text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            type="text"
            name="username"
            autoComplete="new-username"
            placeholder="Username"
            className="text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"
          />
          <input
            value={pass1}
            onChange={(e) => set_pass1(e.target.value)}
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"
          />
          <input
            value={pass2}
            onChange={(e) => set_pass2(e.target.value)}
            required
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className="text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"
          />
          <div className="flex gap-4 w-full">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="flex-1 p-4 text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs"
            >
              <option value="" disabled>
                Day
              </option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setMonth(e.target.value)}
              value={month}
              className="flex-1 p-4 text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs"
            >
              <option value="" disabled>
                Month
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setYear(e.target.value)}
              value={year}
              className="flex-1 p-4 text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs"
            >
              <option value="" disabled>
                Year
              </option>
              {Array.from({ length: 2026 - 1940 + 1 }, (_, i) => 2026 - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ),
              )}
            </select>
          </div>
        </form>
        <button
          onClick={handleSubmit}
          className="text-black font-bold text-[20px] cursor-pointer p-4 bg-white rounded-4xl w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

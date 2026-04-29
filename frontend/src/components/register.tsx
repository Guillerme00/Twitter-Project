import { useState } from "react";
import XIcon from "../assets/icons/x_logo.svg?react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export function Register() {
  //types
  type RegisterData = {
    name: string;
    email: string;
    username: string;
    password: string;
    birthday: string;
  };

  //consts
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

  const navigate = useNavigate();

  //states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [nameValid, setNameValid] = useState("untouched");
  const [usernameValid, setUsernameValid] = useState("untouched");
  const [emailValid, setEmailValid] = useState("untouched");
  const [pass2Valid, setPass2Valid] = useState("untouched");
  const [passValid, setPassValid] = useState("untouched");

  const [passwordtest1, setPasswordtest1] = useState(false);
  const [passwordtest2, setPasswordtest2] = useState(false);
  const [passwordtest3, setPasswordtest3] = useState(false);
  const [passwordtest4, setPasswordtest4] = useState(false);
  const [passwordtest5, setPasswordtest5] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [inError, setInError] = useState("untouched");
  const [seconds, setSeconds] = useState(3);

  //functions
  const goToLogin = (): void | Promise<void> => {
    return navigate("/signin");
  };

  const post_register = async (UserData: RegisterData): Promise<number> => {
    const response = await axios.post(
      "http://localhost:8000/api/users/",
      UserData,
    );
    return response.status;
  };

  const validName = (name: string): void => {
    if (name.length >= 3 && name.length <= 25) {
      setNameValid("valid");
      return;
    }
    setNameValid("invalid");
  };

  const validUsername = (username: string): void => {
    if (username.length >= 4 && username.length <= 16) {
      setUsernameValid("valid");
      return;
    }
    setUsernameValid("invalid");
  };

  const validEmail = (email: string): void => {
    if (/@/.test(email)) {
      setEmailValid("valid");
      return;
    }
    setEmailValid("invalid");
  };

  const hasNumber = (pass1: string): boolean => {
    const response = /[0-9]/.test(pass1);
    return response;
  };
  const hasLower = (pass1: string): boolean => {
    const response = /[a-z]/.test(pass1);
    return response;
  };
  const hasUpper = (pass1: string): boolean => {
    const response = /[A-Z]/.test(pass1);
    return response;
  };
  const hasSpecial = (pass1: string): boolean => {
    const response = /[!@#$%&*]/.test(pass1);
    return response;
  };
  const verifyQuantity = (pass1: string): boolean => {
    if (pass1.length >= 8 && pass1.length <= 20) {
      return true;
    }
    return false;
  };

  const verify_password = (pass1: string): void => {
    const number = hasNumber(pass1);
    const lower = hasLower(pass1);
    const upper = hasUpper(pass1);
    const special = hasSpecial(pass1);
    const quantity = verifyQuantity(pass1);

    setPasswordtest1(number);
    setPasswordtest2(lower);
    setPasswordtest3(upper);
    setPasswordtest4(special);
    setPasswordtest5(quantity);

    if (number && lower && upper && special && quantity) {
      setPasswordVerified(true);
      setPassValid("valid");
      return;
    }
    setPassValid("invalid");
    setPasswordVerified(false);
  };

  const password_match = pass1 === pass2;

  const pass2isvalid = (password1: string, password2: string): void => {
    if (password1 == password2) {
      setPass2Valid("valid");
      return;
    }
    setPass2Valid("invalid");
  };

  const set_pass1 = (password: string): void => {
    setPass1(password);
  };

  const set_pass2 = (password: string): void => {
    setPass2(password);
  };

  const handleSubmit = async () => {
    if (
      !password_match ||
      !passwordVerified ||
      nameValid !== "valid" ||
      usernameValid !== "valid" ||
      !emailValid
    ) {
      setInError("erro");
      return;
    }
    const birthday = `${year}-${months.indexOf(month) + 1}-${day}`;
    const UserDate = { name, email, username, password: pass1, birthday };
    try {
      await post_register(UserDate);
      setInError("ok");
      redirecting();
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  };

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
    navigate("/signin");
    return;
  }

  //body
  return (
    <div className="flex flex-col items-center pt-[64px]">
      <XIcon className="fill-white" />
      <div className="w-full max-w-[550px] flex flex-col items-center">
        <form className="flex flex-col items-center w-full mt-4">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validName(e.target.value);
            }}
            required
            type="text"
            name="name"
            placeholder="Full Name"
            className="text-white placeholder-stone-700 p-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />
          {nameValid === "invalid" && (
            <h1 className="text-red-500">
              Error, Name must have between 3 and 25 characters
            </h1>
          )}

          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validEmail(e.target.value);
            }}
            required
            type="email"
            name="email"
            placeholder="E-mail"
            className="text-white placeholder-stone-700 p-4 mt-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />
          {emailValid === "invalid" && (
            <h1 className="text-red-500">Error, Insert a valid email</h1>
          )}

          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              validUsername(e.target.value);
            }}
            required
            type="text"
            name="username"
            autoComplete="new-username"
            placeholder="Username"
            className="text-white placeholder-stone-700 p-4 mt-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />
          {usernameValid === "invalid" && (
            <h1 className="text-red-500">
              Error, Username must have between 4 and 16 characters
            </h1>
          )}

          <input
            value={pass1}
            onChange={(e) => {
              set_pass1(e.target.value);
              verify_password(e.target.value);
              pass2isvalid(e.target.value, pass2);
            }}
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="text-white placeholder-stone-700 p-4 mt-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />
          {passValid === "invalid" && (
            <h2
              className={`${passwordtest1 ? "text-green-500" : "text-red-500"} mb-4`}
            >
              Password must have at least a number
            </h2>
          )}
          {passValid === "invalid" && (
            <h2
              className={`${passwordtest2 ? "text-green-500" : "text-red-500"} mb-4`}
            >
              Password must have at least a lower letter
            </h2>
          )}
          {passValid === "invalid" && (
            <h2
              className={`${passwordtest3 ? "text-green-500" : "text-red-500"} mb-4`}
            >
              Password must have at least a upper letter
            </h2>
          )}
          {passValid === "invalid" && (
            <h2
              className={`${passwordtest4 ? "text-green-500" : "text-red-500"} mb-4`}
            >
              Password must have at least a special character
            </h2>
          )}
          {passValid === "invalid" && (
            <h2
              className={`${passwordtest5 ? "text-green-500" : "text-red-500"} mb-4`}
            >
              Password must have between 8 and 20 characters
            </h2>
          )}

          <input
            value={pass2}
            onChange={(e) => {
              set_pass2(e.target.value);
              pass2isvalid(pass1, e.target.value);
            }}
            required
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className="text-white placeholder-stone-700 p-4 mt-4 text-[20px] mb-1 border-stone-700 border-2 rounded-xs w-full"
          />
          {pass2Valid === "invalid" && (
            <h1 className="text-red-500">Error, password do not match</h1>
          )}
          <div className="flex gap-4 w-full mt-4">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="flex-1 p-4 bg-black text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs"
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
              className="flex-1 p-4 bg-black text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs"
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
              className="flex-1 p-4 bg-black text-white placeholder-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs"
            >
              <option value="" disabled>
                Year
              </option>
              {Array.from({ length: 2026 - 1900 + 1 }, (_, i) => 2026 - i).map(
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
        {inError === "ok" && (
          <h1 className="text-green-500">
            Registered, redirecting in {seconds}
          </h1>
        )}
        <p className="text-stone-500 mt-4">
          Already have an account?{" "}
          <button
            onClick={goToLogin}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

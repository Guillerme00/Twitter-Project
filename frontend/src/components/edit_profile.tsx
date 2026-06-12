import { useState } from "react";
import AddPhoto from "../assets/icons/addphoto2.svg?react";

type editProps = {
  toggleEditProfile: () => void;
  handleSaveProfile: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  setNewPasswordValid: React.Dispatch<React.SetStateAction<string>>;
  profile_image: string;
  profile_banner: string;
  setProfileBanner: React.Dispatch<React.SetStateAction<string>>;
  setProfileImage: React.Dispatch<React.SetStateAction<string>>;
  setProfileBannerFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProfileImageFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export const EditProfile = ({
  toggleEditProfile,
  handleSaveProfile,
  bio,
  name,
  profile_banner,
  profile_image,
  setBio,
  setName,
  setProfileBanner,
  setProfileImage,
  setProfileBannerFile,
  setProfileImageFile,
  setNewPassword,
  setNewPasswordValid,
}: editProps) => {
  const [passValid, setPassValid] = useState("untouched");
  const [pass2Valid, setPass2Valid] = useState("untouched");

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [passwordtest1, setPasswordtest1] = useState(false);
  const [passwordtest2, setPasswordtest2] = useState(false);
  const [passwordtest3, setPasswordtest3] = useState(false);
  const [passwordtest4, setPasswordtest4] = useState(false);
  const [passwordtest5, setPasswordtest5] = useState(false);

  const set_pass1 = (password: string): void => {
    setPass1(password);
  };

  const set_pass2 = (password: string): void => {
    setPass2(password);
  };

  const pass2isvalid = (password1: string, password2: string): void => {
    if (password1 === password2) {
      setPass2Valid("valid");
      setNewPasswordValid("valid");
      return;
    }

    setPass2Valid("invalid");
    setNewPasswordValid("invalid");
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

  const verify_password = (password: string): void => {
    const number = hasNumber(password);
    const lower = hasLower(password);
    const upper = hasUpper(password);
    const special = hasSpecial(password);
    const quantity = verifyQuantity(password);

    setPasswordtest1(number);
    setPasswordtest2(lower);
    setPasswordtest3(upper);
    setPasswordtest4(special);
    setPasswordtest5(quantity);

    if (number && lower && upper && special && quantity) {
      setPassValid("valid");
      return;
    }

    setPassValid("invalid");
    setNewPasswordValid("invalid");
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="max-w-[640px] w-full max-h-[90vh] overflow-y-auto rounded-sm bg-[#0b0b0b] p-4 no-scrollbar">
        <div className="flex justify-between items-center w-full h-12">
          <div className="flex items-center">
            <button
              className="text-[20px] hover:bg-stone-800 w-8 h-8 flex items-center justify-center rounded-full font-bold cursor-pointer transition-colors duration-300"
              onClick={() => toggleEditProfile()}
            >
              X
            </button>
            <h1 className="font-bold text-[20px] ml-8"> Edit profile</h1>
          </div>
          <button
            className="px-4 py-1 bg-white text-black rounded-full font-bold cursor-pointer hover:opacity-80 transition mr-2"
            onClick={() => handleSaveProfile()}
          >
            Save
          </button>
        </div>
        <div className="mt-4 relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="bannerInput"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setProfileBannerFile(file);
                setProfileBanner(URL.createObjectURL(file));
              }
            }}
          />
          <img
            src={profile_banner}
            className="max-w-[640px] max-h-[320px] rounded-sm w-full"
            alt=""
          />
          <div className="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-6">
            <button
              className="text-[20px] hover:bg-black/50 bg-black/75 p-2 w-12 h-12 flex items-center justify-center rounded-full font-bold cursor-pointer transition-colors duration-300"
              onClick={() => document.getElementById("bannerInput")?.click()}
            >
              <AddPhoto className="w-6 h-6 pointer-events-none" />
            </button>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageInput"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setProfileImageFile(file);
                  setProfileImage(URL.createObjectURL(file));
                }
              }}
            />
            <img
              src={profile_image}
              className="rounded-full overflow-hidden w-32 h-32"
            />
            <div className="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-6">
              <button
                className="text-[20px] hover:bg-black/50 bg-black/75 p-2 w-12 h-12 flex items-center justify-center rounded-full font-bold cursor-pointer transition-colors duration-300"
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                <AddPhoto className="w-6 h-6 pointer-events-none" />
              </button>
            </div>
          </div>
          <div className="border border-stone-700 rounded-md ml-4 px-3 py-2 bg-[#0b0b0b] flex-1">
            <p className="text-stone-500 text-sm">Name</p>
            <input
              value={name}
              type="text"
              className="bg-transparent outline-none text-3xl font-bold w-full"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="border border-stone-700 rounded-md ml-4 px-3 py-2 bg-[#0b0b0b] flex-1 mt-4">
          <p className="text-stone-500 text-sm">Bio</p>
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            type="text"
            className="bg-transparent outline-none text-3xl font-bold w-full"
          />
        </div>
        <div className="border border-stone-700 rounded-md ml-4 px-3 py-2 bg-[#0b0b0b] flex-1 mt-4">
          <p className="text-stone-500 text-sm">New Password (optional)</p>
          <input
            value={pass1}
            onChange={(e) => {
              const value = e.target.value;

              set_pass1(value);
              verify_password(value);
              pass2isvalid(value, pass2);
              setNewPassword(value);
            }}
            type="password"
            name="password"
            autoComplete="new-password"
            className="bg-transparent outline-none text-3xl font-bold w-full"
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
        </div>
        <div className="border border-stone-700 rounded-md ml-4 px-3 py-2 bg-[#0b0b0b] flex-1 mt-4">
          <p className="text-stone-500 text-sm">Confirm Password</p>
          <input
            value={pass2}
            onChange={(e) => {
              const value = e.target.value;

              set_pass2(value);
              pass2isvalid(pass1, value);
            }}
            type="password"
            autoComplete="new-password"
            className="bg-transparent outline-none text-3xl font-bold w-full"
          />
          {pass2Valid === "invalid" && (
            <h1 className="text-red-500">Error, password do not match</h1>
          )}
        </div>
      </div>
    </div>
  );
};

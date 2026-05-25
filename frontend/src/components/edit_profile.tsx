import AddPhoto from "../assets/icons/addphoto2.svg?react";
import Close from "../assets/icons/close.svg?react";

type editProps = {
  toggleEditProfile: () => void;
  handleSaveProfile: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
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
  setProfileImageFile
}: editProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="max-w-[640px] flex flex-col w-full rounded-sm bg-[#0b0b0b] flex p-4">
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
          <img
            src={profile_banner}
            className="max-w-[640px] rounded-sm w-full"
            alt=""
          />
          <div className="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-6">
            <button
              className="text-[20px] hover:bg-black/50 bg-black/75 p-2 w-12 h-12 flex items-center justify-center rounded-full font-bold cursor-pointer transition-colors duration-300"
              onClick={() => toggleEditProfile()}
            >
              <Close className="w-6 h-6 pointer-events-none"/>
            </button>
            <button
              className="text-[20px] hover:bg-black/50 bg-black/75 p-2 w-12 h-12 flex items-center justify-center rounded-full font-bold cursor-pointer transition-colors duration-300"
              onClick={() => toggleEditProfile()}
            >
              <AddPhoto className="w-6 h-6 pointer-events-none"/>
            </button>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <img
            src={profile_image}
            className="rounded-full overflow-hidden w-32 h-32"
          />
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
      </div>
    </div>
  );
};

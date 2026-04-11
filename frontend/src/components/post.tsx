import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";

/*The props are still missing.*/

export function Post() {
  return (
    <div className="bg-black flex p-4 w-1/2">
    <img
        className="rounded-full w-[64px] h-[64px] cursor-pointer self-start"
        src="https://placehold.co/64x64"
        alt="profile_picture"
    />
    <div className="flex flex-col flex-1 ml-3">
        <div className="flex items-center mb-2">
        <h2 className="pr-1 text-white text-xl">Guilherme</h2>
        <h2 className="pr-1 text-stone-500 text-xl">@guillerme0</h2>
        <h4 className="text-stone-500 text-lg"> · 3h</h4>
        </div>

        <h2 className="text-white text-xl">ablubleeeee</h2>
        <img
        className="w-full rounded-md mt-4 mb-4"
        src="https://placehold.co/700x500"
        alt=""
        />

        <div className="flex justify-center gap-32">
        <div className="flex items-center">
            <CommentIcon className="fill-white cursor-pointer hover:fill-blue-500" />
            <h2 className="text-white ml-1">0</h2>
        </div>
        <div className="flex items-center">
            <RetweetIcon className="fill-white cursor-pointer hover:fill-green-400" />
            <h2 className="text-white ml-1">0</h2>
        </div>
        <div className="flex items-center">
            <LikeIcon className="fill-white cursor-pointer hover:fill-red-600" />
            <h2 className="text-white ml-1">0</h2>
        </div>
        </div>
    </div>
    </div>
  );
}

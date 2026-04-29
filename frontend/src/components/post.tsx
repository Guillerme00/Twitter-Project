import CommentIcon from "../assets/icons/comment-alt.svg?react";
import LikeIcon from "../assets/icons/heart.svg?react";
import RetweetIcon from "../assets/icons/retweet.svg?react";

type PostProps = {
  name: string;
  username: string;
  profileImage: string;
  content: string;
  postImage?: string;
  comments: number;
  likes: number;
  retweets: number;
  created_at: string;
};

function CalcTemp(created_at: string) {
  const now = new Date();
  const postDate = new Date(created_at);
  const time = now.getTime() - postDate.getTime();
  if (time / 1000 < 1) {
    return "1s";
  } else if (time / 1000 < 60) {
    return `${Math.floor(time / 1000)}s`; //seconds
  } else if (time / 60000 < 60) {
    return `${Math.floor(time / 60000)}m`; //minutes
  } else if (time / 3600000 < 24) {
    return `${Math.floor(time / 3600000)}h`; //hours
  } else {
    return `${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`; //day
  }
}

export function Post(props: PostProps) {
  return (
    <div className="bg-black flex p-4 mr-2">
      <img
        className="rounded-full w-[48px] h-[48px] cursor-pointer self-start"
        src={props.profileImage}
        alt="profile_picture"
      />
      <div className="flex flex-col flex-1 ml-3">
        <div className="flex items-center">
          <h2 className="pr-1 text-[#E7E9EA] text-[16px] cursor-pointer">
            {props.name}
          </h2>
          <h2 className="pr-1 text-stone-500 text-[16px]">@{props.username}</h2>
          <h4 className="text-stone-500 text-[16px]">
            {" "}
            · {CalcTemp(props.created_at)}
          </h4>
        </div>

        <h2 className="text-[#E7E9EA] text-[18px]">{props.content}</h2>
        {props.postImage && (
          <img
            className="w-full rounded-md mt-4 mb-4 object-cover cursor-pointer"
            src={props.postImage}
            alt=""
          />
        )}

        <div className="flex justify-center gap-32">
          <div className="flex items-center group cursor-pointer">
            <CommentIcon className="fill-stone-500 cursor-pointer group-hover:fill-blue-500 w-8 h-8 transition-colors duration-300" />
            <h2 className="text-stone-500 ml-1 group-hover:text-blue-500 transition-colors duration-300">
              {props.comments}
            </h2>
          </div>
          <div className="flex items-center group cursor-pointer">
            <RetweetIcon className="fill-stone-500 group-hover:fill-green-400 w-8 h-8 transition-colors duration-300" />
            <h2 className="text-stone-500 ml-1 group-hover:text-green-400 transition-colors duration-300">
              {props.retweets}
            </h2>
          </div>
          <div className="flex items-center group cursor-pointer">
            <LikeIcon className="fill-stone-500 group-hover:fill-red-600 w-8 h-8 transition-colors duration-300" />
            <h2 className="text-stone-500 ml-1 group-hover:text-red-600 transition-colors duration-300">
              {props.likes}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

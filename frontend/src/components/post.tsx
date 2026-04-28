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
    <div className="bg-black flex p-4">
      <img
        className="rounded-full w-[64px] h-[64px] cursor-pointer self-start"
        src={props.profileImage}
        alt="profile_picture"
      />
      <div className="flex flex-col flex-1 ml-3">
        <div className="flex items-center mb-2">
          <h2 className="pr-1 text-white text-xl">{props.name}</h2>
          <h2 className="pr-1 text-stone-500 text-xl">@{props.username}</h2>
          <h4 className="text-stone-500 text-lg">
            {" "}
            · {CalcTemp(props.created_at)}
          </h4>
        </div>

        <h2 className="text-white text-xl">{props.content}</h2>
        {props.postImage && (
          <img
            className="w-full rounded-md mt-4 mb-4"
            src={props.postImage}
            alt=""
          />
        )}

        <div className="flex justify-center gap-32">
          <div className="flex items-center">
            <CommentIcon className="fill-white cursor-pointer hover:fill-blue-500" />
            <h2 className="text-white ml-1">{props.comments}</h2>
          </div>
          <div className="flex items-center">
            <RetweetIcon className="fill-white cursor-pointer hover:fill-green-400" />
            <h2 className="text-white ml-1">{props.retweets}</h2>
          </div>
          <div className="flex items-center">
            <LikeIcon className="fill-white cursor-pointer hover:fill-red-600" />
            <h2 className="text-white ml-1">{props.likes}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

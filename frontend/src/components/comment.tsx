import { useEffect, useState } from "react"

const post: PostProps = {
  author: {
    bio: "Desenvolvedor fullstack apaixonado por UI.",
    birthday: "2005-08-12",
    email: "gui@example.com",
    followers_count: 152,
    following_count: 89,
    id: 1,
    name: "Guilherme",
    profile_banner:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    profile_image:
      "https://placehold.co/600x600",
    username: "gui_dev",
  },
  comments: [],
  created_at: "2026-05-06T13:00:00Z",
  id: 101,
  likes: [2, 5, 8],
  likes_count: 3,
  medias: [
    {
      id: 1,
      file:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
      order: 1,
    },
  ],
  post_body:
    "alulululululuUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
  retweets: [
    {
      author: 2,
      created_at: "2026-05-06T13:10:00Z",
      id: 1,
      post: 101,
    },
  ],
};

type PostProps = {
  author: {
    bio: string;
    birthday: string;
    email: string;
    followers_count: number;
    following_count: number;
    id: number;
    name: string;
    profile_banner: string;
    profile_image: string;
    username: string;
  };
  comments: [];
  created_at: string;
  id: number;
  likes: number[];
  likes_count: number;
  medias: {
    id: number;
    file: string;
    order: number;
  }[];
  post_body: string;
  retweets: {
    author: number,
    created_at: string,
    id: number,
    post: number
  }[];
};

type ActualUser = {
  id: number;
  name: string;
  email: string;
  username: string;
  profile_image: string;
  profile_banner: string;
  bio: string;
  followers_count: number;
  following_count: number;
  bithday: string;
};

export function CommentInPost() {

    const [actualUser, setActualUser] = useState<ActualUser | null>(null);
    const [postComment, setpostComment] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const validPost = postComment.length >= 1 && postComment.length <= 500;

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

    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-stone-900 max-w-800 w-[800px] p-4 rounded-xl">
                <div><button className="hover:bg-stone-800 w-8 h-8 flex items-center justify-center rounded-full font-bold cursor-pointer text-[20px] transition-colors duration-300">X</button></div> {/* close button */}

                <div
                    className=" flex p-4 mr-2 w-[100%]"
                    key={post.id}
                >
                    <img
                    className="rounded-full w-[48px] h-[48px] cursor-pointer self-start"
                    src={post.author.profile_image}
                    alt="profile_picture"
                    />
                    <div className="flex flex-col ml-3">
                    <div className="flex items-center">
                        <h2 className="pr-1 text-[#E7E9EA] text-[16px] cursor-pointer">
                        {post.author.name}
                        </h2>
                        <h2 className="pr-1 text-stone-500 text-[16px]">
                        @{post.author.username}
                        </h2>
                        <h4 className="text-stone-500 text-[16px]">
                        {" "}
                        · {CalcTemp(post.created_at)}
                        </h4>
                    </div>

                    <h2 className="no-scrollbar text-[16px] text-[#E7E9EA] break-all">
                        {post.post_body}
                    </h2>
                    {post.medias &&
                        post.medias.map((media) => (
                        <img
                            className="w-full rounded-md block mt-4 mb-4 max-w-[400px] object-cover cursor-pointer"
                            src={media.file}
                            alt=""
                            key={media.id}
                        />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col p-4 border-b border-stone-800">
                    <div className="flex flex-col">
                    <div className="flex">
                        <img
                        src={actualUser?.profile_image}
                        alt="profile_picture"
                        className="rounded-full w-12 h-12 min-h-12 min-w-12 object-cover"
                        />
                        <textarea
                        placeholder="What's happening?"
                        className="no-scrollbar bg-transparent outline-none ml-4 text-[20px] w-full text-sm text-[#E7E9EA] placeholder-stone-500 resize-none border-b border-stone-800"
                        onChange={(s) => {
                            setpostComment(s.target.value);
                            s.target.style.height = "auto";
                            s.target.style.height = s.target.scrollHeight + "px";
                        }}
                        onPaste={(e) => {
                            const items = e.clipboardData.items;

                            for (let i = 0; i < items.length; i++) {
                            const item = items[i];

                            if (item.type.startsWith("image")) {
                                const file = item.getAsFile();

                                if (file) {
                                setImage(file);

                                const url = URL.createObjectURL(file);
                                setPreview(url);
                                }
                            }
                            }
                        }}
                        value={postComment}
                        />
                    </div>
                    {preview && (
                        <>
                        <img
                            src={preview}
                            alt="preview"
                            className="mt-2 rounded-xl max-h-80 object-cover"
                        />
                        <div className="border-b border-stone-800 pb-4" />
                        </>
                    )}
                    </div>
                    <div className="flex justify-end mt-2">
                    <button
                        disabled={!validPost}
                        className={`text-black font-bold p-2 pr-4 pl-4 rounded-full transition-all duration-300 ${
                        validPost
                            ? "bg-[#E7E9EA] text-black hover:bg-[#cfcfcf] cursor-pointer"
                            : "bg-stone-700 text-black opacity-50 cursor-not-allowed"
                        }
                    `}
                    >
                        Post
                    </button>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="hover:bg-stone-300 w-24 h-8 p-1 pr-2 pl-2 text-bold flex items-center justify-center rounded-full font-bold cursor-pointer text-[16px] bg-[#E7E9EA] text-stone-900 transition-colors duration-300">Reply</button> {/*reply button */}
                </div>
            </div>
        </div>
    )
} 
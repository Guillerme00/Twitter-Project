import CommentIcon from "../assets/icons/comment.svg?react"

export function Post() {
    return (
        <div className="bg-black flex flex-col p-4 w-1/2">
            <div id="post_header" className="flex items-center mb-4">
                <img className="rounded-full cursor-pointer" id="profile_image" src="https://placehold.co/64x64" alt="" />
                <h2 className="pl-1 pr-1 text-white " id="profile_name">Guilherme</h2>
                <h2 className="pr-1 text-stone-500" id="profile_username">@guillerme0</h2>
                <h4 id="created_at" className="text-stone-500"> · 3h</h4>
            </div>
            <div>
                <h2 className="text-white">ablubleeeee</h2>
                <img className="w-100% rounded-md mt-4 mb-4" src="https://placehold.co/1000x300" alt="" />
            </div>
            <div>
                <CommentIcon className="fill-white w-8"></CommentIcon>
            </div>
        </div>
    )
}
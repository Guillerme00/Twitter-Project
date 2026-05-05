import { useEffect } from "react"

export function CommentInPost() {

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

                <div> {/* post to be commented */}
                    <h1>post post</h1>
                </div>

                <div> {/* comment */}
                    <h1>comment comment</h1>
                </div>
                <div className="flex justify-end">
                    <button className="hover:bg-stone-300 w-24 h-8 p-1 pr-2 pl-2 text-bold flex items-center justify-center rounded-full font-bold cursor-pointer text-[16px] bg-[#E7E9EA] text-stone-900 transition-colors duration-300">Reply</button> {/*reply button */}
                </div>
            </div>
        </div>
    )
} 
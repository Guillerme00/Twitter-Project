import XIcon from "../assets/icons/x_logo.svg?react";

export function Register() {
    return (
        <div className="flex flex-col items-center pt-[64px]">
            <XIcon className="fill-white"/>
            <div className="w-full max-w-[550px]">
                <form className="flex flex-col items-center w-full mt-4">
                    <input required type="text" name="name" placeholder="Full Name" className="text-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"/>
                    <input required type="email" name="email" placeholder="E-mail" className="text-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"/>
                    <input required type="text" name="username" placeholder="Username" className="text-stone-700 p-4 text-[20px] mb-4 border-stone-700 border-2 rounded-xs w-full"/>
                    <button className="text-black font-bold text-[20px] cursor-pointer p-4 bg-white rounded-4xl w-full">Continue</button>
                </form>
            </div>
        </div>
    )
}
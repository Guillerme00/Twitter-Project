import { useEffect, useState } from "react";

type deleteOverlay = {
    cancel: () => void
    deleteAccount: () => void
}

export function DeletingPost({cancel, deleteAccount} :deleteOverlay) {

    const [timer, setTimer] = useState(5)

    useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
    
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
        <div className="bg-stone-900 w-full max-w-[500px] p-4 rounded-xl overflow-y-auto max-h-[90vh] overflow-x-hidden no-scrollbar flex flex-col items-center">
            <h1 className="text-red-500 font-bold">WARNING</h1>
            <h2>Are you <strong className="text-red-500 font-bold">Sure</strong> you want to delete your account?</h2>
            <div className="mt-3 flex gap-5 items-center">
                <button className="p-2 rounded-full border-stone-500 border cursor-pointer hover:bg-stone-500 transition-colors duration-300"
                onClick={() => cancel()}
                >Cancel</button>
                {timer > 0
                ? <button disabled className="p-2 rounded-full bg-stone-500 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Delete
                </button>
                : <button className="p-2 rounded-full border-red-500 border cursor-pointer hover:bg-red-500"onClick={() => deleteAccount()}>
                    Delete
                </button>
                }
                <h1>{timer > 0 ? timer : false}</h1>
            </div>
        </div>
    </div>
  );
}

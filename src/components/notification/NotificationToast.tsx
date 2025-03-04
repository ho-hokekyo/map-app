import { useEffect, useState } from "react";
import { CloseIcon } from "../Icon/CloseIcon";


export const NotificationToast = ({text, duration, onClose}: {text:string; duration:number; onClose:() => void}) => {
    const [progress, setProgress] = useState("100%");

    useEffect(() => {
        setTimeout(() => {
        onClose();
        }, duration);

        // 進捗バーのアニメーション開始
        setTimeout(() => {
        setProgress("0%");
        }, 10);
    }, [duration, onClose]);

    return (
        <div className="w-full max-w-xs mx-auto">

            <div id="toast-default" className="flex items-center p-4 bg-white rounded-lg shadow-sm" role="alert">
                {/* icon */}
                {/* <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-200 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
                    </svg>
                    <span className="sr-only">Fire icon</span>
                    </div> */}

                {/* Content */}
                <div className="ms-3 text-sm font-normal text-black">{text}</div>

                {/* Close button */}
                <button type="button" className="ms-auto -mx-1.5 -my-1.5 text-gray-300 transition hover:text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-300 hover:scale-105 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-default" aria-label="Close" onClick={onClose}>
                    <span className="sr-only">Close</span>
                    {/* <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg> */}
                    <CloseIcon />
                </button>
            </div>
            
            {/* indicator */}
            <div className="relative h-0.5 rounded-full">
                <div className="absolute top-0 left-0 h-full bg-violet-400 transition-all ease-linear" style={{ width: progress, transitionDuration: `${duration}ms` }} />
            </div>
    
        </div>
    )
}


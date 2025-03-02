'use client';

import { ToastProvider } from "@/hooks/useToast";
import { useToast } from "@/hooks/useToast";
import {NotificationListener} from "@/components/notification/NotificationListener";
import { useEffect } from "react";

const NotificationPage = () =>{

    const setToast = useToast();

    const userId = "user1";
    const startProcess = async () => {
        console.log("start process");
        try{

            const  response = await fetch("/api/notification",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId})
            })
            if(!response.ok){
                throw new Error("Failed to start process");
            }
        }catch(error){
            console.error(error);
            // 失敗時も画面上に通知する

            
        }
    }
    useEffect(() => {
        setTimeout(() =>{
            startProcess();
        }, 3000)
    }
    ,[])

    return (
        <ToastProvider>
            <div>
                <button
                    onClick={startProcess}
                
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full active:bg-blue-800">
                    Start Process
                </button>
                <p>text</p>
            </div>
            <NotificationListener />

        </ToastProvider>
    )
}

export default NotificationPage;
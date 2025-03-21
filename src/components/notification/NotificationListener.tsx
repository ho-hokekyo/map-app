"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";

export const NotificationListener = () => {
    const {data: session, status} = useSession();
    const [userId, setUserId] = useState<string>("default");
    useEffect(() =>{
        if(session?.user?.id){
            console.log("session", session)
            setUserId(session.user.id);
        }
    }, [session])
    
    const {socket, connectSocket, disconnectSocket} = useSocket(userId);
    const showToast = useToast();

    // 接続管理: 特定の処理の間だけ接続を確立したい場合はその状態を使用する. デフォルトは常に通信を確立する
    useEffect(() => {
        if (!socket){
            connectSocket();
        }
    },[socket, connectSocket])



    const handleNormalNotification = () =>{
        console.log("notification received");
        showToast({text: "You have a new notification!", type: "normal", duration: 5000});
    }

    const handleErrorNotification = () => {
        console.log("error notification received");
        showToast({text: "Failed to generate image.", type: "error", duration: 5000});
    }

    const handleSuccessNotification = () => {
        console.log("success notification received");
        showToast({text: "Image generated successfully!", type: "success", duration: 10000});
    }

    const handlePostNotification = (arg1: string) => {
        console.log("new post was created");
        showToast({text: "New post was created!", type: "normal", duration: 5000});
    }
    // 
    useEffect(() =>{
        if (!socket) return;
        socket.on("notification to all user", handleNormalNotification);
        socket.on("normal notification", handleNormalNotification);
        socket.on("error notification", handleErrorNotification);
        socket.on("success notification", handleSuccessNotification);
        socket.on("new post was created", (arg1) => handlePostNotification(arg1));
        
        return () =>{
            socket.off("notification to all user", handleNormalNotification);
            socket.off("normal notification", handleNormalNotification);
            socket.off("error notification", handleErrorNotification);
            socket.off("success notification", handleSuccessNotification);
            socket.off("new post was created", handlePostNotification);
        }
    }, [socket, disconnectSocket])

    return null;
}
"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

export const NotificationListener = () => {
    const userId = "user1";
    const {socket, connectSocket, disconnectSocket} = useSocket(userId);
    const showToast = useToast();

    // 接続管理: 特定の処理の間だけ接続を確立したい場合はその状態を使用する. デフォルトは常に通信を確立する
    useEffect(() => {
        if (!socket){
            connectSocket();
        }
    },[socket, connectSocket])

    // 
    useEffect(() =>{
        if (!socket) return;

        // 通知時の処理
        const handleNotification = () =>{

            console.log("notification received");

            // 受け取った通知を表示する
            showToast({text: "You have a new notification!", type: "success"});

            
        }

        socket.on("notification to one user", handleNotification);
        
        return () =>{
            socket.off("notification to one user", handleNotification);
        }
    }, [socket, disconnectSocket])

    return null;
}
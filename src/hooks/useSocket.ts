'use client';

import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAtom } from 'jotai';
import { Socket } from 'socket.io-client';
import { atom } from 'jotai';

const socketAtom = atom<Socket | null>(null);

// 接続を確立する関数
const connectSocket = (userId: string) => {
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, {
        reconnection: true,
        reconnectionAttempts: 3,
    });

    newSocket.on('connect', () => {
        // ユーザーごとのルームに入る
        newSocket.emit('joinRoom', userId);
    });

    return newSocket;
};

/**
 * サーバーとの通信を管理するためのカスタムフック
 * @param userId ユーザーID
 * @returns socket: Socket, connectSocket: () => void, disconnectSocket: () => void
 */

export const useSocket = (userId: string) => {
    // Socketのインスタンスをグローバルに管理する
    const [socket, setSocket] = useAtom(socketAtom);

    // サーバーへの接続を確立する関数
    const connectSocketWithUser = useCallback(() => {
        setSocket(connectSocket(userId));
    }, [userId, setSocket]);

    const disconnectSocket = useCallback(() => {
        if (socket) {
            socket?.disconnect();
            setSocket(null);
        }
    }, [socket, setSocket]);

    // アンマウントされた際に接続を切断する
    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, [disconnectSocket]);

    return {
        socket,
        connectSocket: connectSocketWithUser,
        disconnectSocket,
    };
};

'use client';

import { useEffect } from 'react';

const NotificationPage = () => {
    const startProcess = async () => {
        console.log('start process');
        try {
            const response = await fetch('/api/notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to start process');
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            startProcess();
        }, 3000);
    }, []);

    return (
        <>
            <div className="w-full h-screen justify-center items-center flex flex-col">
                <button
                    onClick={startProcess}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full active:bg-blue-800"
                >
                    Send
                </button>
                <p>text</p>
            </div>
            <div className="fixed top-0 w-auto z-50"></div>
        </>
    );
};

export default NotificationPage;

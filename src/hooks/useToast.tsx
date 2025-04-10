'use client';
import React, { useState, useEffect, useContext, createContext, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationToast } from '@/components/notification/NotificationToast';

type ToastTypes = 'normal' | 'error' | 'success';
type ToastProps = {
    id: number;
    text: string;
    duration: number;
    toastType: ToastTypes;
    onClose: () => void;
    // args?: any;
};

const ToastContext = createContext(
    ({}: { text: string; type?: ToastTypes; duration: number }) => {},
);
ToastContext.displayName = 'ToastContext';

export const useToast = () => {
    return useContext(ToastContext);
};

// ToastのContextを提供する
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const showToast = ({
        text,
        toastType,
        duration = 10000,
    }: {
        text: string;
        toastType?: ToastTypes;
        duration: number;
    }) => {
        const id = Date.now();
        const onClose = () => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        };
        setToasts((prev) => [
            ...prev,
            { id, text, toastType: toastType || 'normal', duration, onClose: onClose },
        ]);
        setTimeout(() => {
            onClose();
        }, duration);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}

            <div className="absolute top-0 w-full py-4 space-y-4 mx-auto">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            text={toast.text}
                            duration={toast.duration}
                            toastType={toast.toastType}
                            onClose={toast.onClose}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

/* 表示の管理

*/

const Toast = ({ id, text, duration, toastType, onClose }: ToastProps) => {
    const getToastStyle = () => {
        switch (toastType) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`${getToastStyle()}`}
            layout
        >
            <NotificationToast text={text} duration={duration} onClose={onClose} />
        </motion.div>
    );
};

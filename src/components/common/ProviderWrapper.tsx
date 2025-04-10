'use client';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/hooks/useToast';

export const ProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ToastProvider>
            <SessionProvider>{children}</SessionProvider>
        </ToastProvider>
    );
};

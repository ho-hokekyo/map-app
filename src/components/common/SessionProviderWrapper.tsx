"use client";
import { SessionProvider } from 'next-auth/react'

export const SessionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
'use client';

import React from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/Icon/PlusIcon';
const ToGenerate = () => {
    return (
        <Link href="/upload">
            <button
                className="z-50 fixed bottom-20 right-4 rounded-full px-4 py-4 w-[4rem] h-[4rem] text-[5rem] bg-gradient-to-tr from-violet-500 to-red-500  border border-violet-500 cursor-pointer shadow-lg flex items-center justify-center
            hover:from-violet-600 hover:to-red-600 hover:border-violet-600
            active:scale-105 transition-transform ease-in duration-100"
            >
                <PlusIcon />
            </button>
        </Link>
    );
};

export default ToGenerate;

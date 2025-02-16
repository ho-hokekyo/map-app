'use client';

import React from 'react';
import Link from 'next/link';

const ToGenerate = () => {
    return (
        <Link href="/generate">
            <button className="z-50 fixed bottom-4 right-4 rounded-full px-4 py-2 w-[5rem] h-[5rem] text-[5rem] bg-gradient-to-tr from-cyan-400 to-blue-500 text-whitesmoke border-2 border-white cursor-pointer  flex items-center justify-center">
                +
            </button>
        </Link>
    );
};

export default ToGenerate;

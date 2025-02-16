'use client';

import Link from 'next/link';

const Footer = () => {
    return (
        <div className="z-50 sticky bottom-0 w-full text-center text-xl font-bold p-0 bg-gradient-to-r from-[#142850] via-[#14365f] to-[#04ccb1]">
            <div className="flex justify-center space-x-4">
                <Link href="/" className="text-white py-2 px-4 rounded">
                    Map
                </Link>
                <Link href="/ranking" className="text-white py-2 px-4 rounded">
                    Ranking
                </Link>
            </div>
        </div>
    );
};

export default Footer;

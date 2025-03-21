'use client';

import Link from 'next/link';

const Footer = () => {
    const items = [
        {href: "/", label: "Map"},
        {href: "/gallery", label: "Gallery"},
        {href: "/other", label: "other"},
    ]
    return (
        <div className="z-50 fixed bottom-5 left-0 w-full bg-white shadow-md border-t flex justify-around py-3 rounded-full">
            {items.map((item, index) => (
                <BarItem key={index} href={item.href} label={item.label} />
            ))}
        </div>
    );
};

const BarItem = ({href, label}: {href:string, label: string}) => {
    return (
        <Link href={href} className="flex flex-col items-center text-gray-700 hover:text-blue-500" >
            {label}
        </Link>
    )
}

export default Footer;

// <div className="z-50 sticky bottom-0 w-full text-center text-xl font-bold p-0 bg-gradient-to-r from-[#142850] via-[#14365f] to-[#04ccb1]">
//             <div className="flex justify-center space-x-4">
                
//             </div>
//         </div>
'use client';

import React from 'react';
import Image from 'next/image';

import FLike from '@mui/icons-material/FavoriteRounded';
import FShare from '@mui/icons-material/SendRounded';

interface DetailProps {
    map: string;
    title: string;
    address: string;
    date: string;
    author: string;
    comment: string;
    // likes: number;
    // replies:
}

const Detail: React.FC<DetailProps> = ({ map, title, address, date, author, comment }) => {
    return (
        <>
            <div className="w-full md:flex px-4">
                <div className="md:w-2/3 px-4 py-4">
                    <Image src={map} alt="Map" layout="responsive" width={700} height={475} />
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="px-6 py-2 rounded-full shadow-lg transform transition-transform hover:scale-105 flex items-center bg-blue-500 text-white"
                            onClick={() => alert('いいね!')}
                        >
                            <FLike className="mr-2" />
                            いいね
                        </button>
                        <button
                            className="px-6 py-2 rounded-full shadow-lg transform transition-transform hover:scale-105 flex items-center bg-green-500 text-white"
                            onClick={() => alert('共有!')}
                        >
                            <FShare className="mr-2" />
                            共有
                        </button>
                    </div>
                </div>
                <div className="md:w-1/3 px-4 py-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <ul className="mt-2 list-none list-inside flex">
                        <li className="flex justify-between w-full">
                            <a
                                href="https://example.com"
                                className="max-w-[70%] text-blue-500 underline overflow-hidden whitespace-nowrap text-ellipsis"
                            >
                                {address}
                            </a>
                            <span className="ml-2">{date}</span>
                        </li>
                    </ul>
                    <div className="mt-4">
                        <ul className="mt-2 list-none list-inside">
                            <li className="mt-2">
                                <p className="font-bold">{author}</p>
                                <p className="w-full text-sm break-words ml-4">{comment}</p>
                            </li>
                            {/* <ul className="ml-4 list-none list-inside mt-2">
                                <li id="more-replies" className="hidden mt-2">
                                    <p className="font-bold">見た人</p>
                                    <p className="w-full text-sm break-words ml-4">すごい</p>
                                </li>
                            </ul>
                            <div className="flex justify-end mt-2">
                                <button
                                    className="text-blue-500 underline"
                                    onClick={() => {
                                        document
                                            .querySelectorAll('#more-replies')
                                            .forEach((el) => el.classList.toggle('hidden'));
                                    }}
                                >
                                    さらに表示
                                </button>
                            </div> */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Detail;

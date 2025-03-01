'use client';

import React from 'react';
import Image from 'next/image';

import FLike from '@mui/icons-material/FavoriteRounded';
import FShare from '@mui/icons-material/SendRounded';
import { ImageOutput } from '@/schema/outputTypeSchema/ImageOutputSchema';
// import { LikeIcon } from '@/components/Icon/LikeIcon';

// interface DetailProps {
//     map: string;
//     title: string;
//     address: string;
//     date: string;
//     author: string;
//     comment: string;
//     // likes: number;
//     // replies:
// }

const Detail = ({image}: {image: ImageOutput}) => {

    const handleClickLike = (id: string) => {
    }
    const handleClickShare = (id: string) => {

    }
    return (
        <>
            <div className="w-full md:flex px-2">
                <div className="">
                    <Image src={image.generatedUrl} alt="Map" layout="responsive" width={1000} height={1000}/>

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="px-6 py-2 hover:scale-105 flex items-center "
                            onClick={() => handleClickLike(image.id)}
                        >
                            <FLike className="mr-2" />
                            {/* <LikeIcon/> */}
                            {image.favorite}
                        </button>
                        <button
                            className="px-6 py-2 rounded-full transform transition-transform hover:scale-105 flex items-center"
                            onClick={() => handleClickShare(image.id)}
                        >
                            <FShare className="mr-2"/>
                            {/* <LikeIcon/> */}
                            Share
                        </button>
                    </div>
                </div>
                <div className="md:w-1/3 px-4 py-4">
                    <h2 className="text-xl font-bold">{image.description}</h2>
                    {/* <ul className="mt-2 list-none list-inside flex">
                        <li className="flex justify-between w-full">
                            <a
                                href="https://example.com"
                                className="max-w-[70%] text-blue-500 underline overflow-hidden whitespace-nowrap text-ellipsis"
                            >
                                {`${image.latitude}, ${image.longitude}`.slice(0, 30)}
                            </a>
                            <p> {image.created_at.toString()}</p>
                        </li>
                    </ul> */}
                    <div>
                        <p className="mt-4">{`${image.latitude}, ${image.longitude}`.slice(0, 30)}</p>
                    </div>
                    <div>
                        <p className="mt-4">{image.created_at.toString()}</p>
                    </div>
                    <div className="mt-4">
                        <ul className="mt-2 list-none list-inside">
                            <li className="mt-2">
                                <p className="">created by UserName</p>
                                <p className="w-full text-sm break-words ml-4">{image.description}</p>
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

'use client';

import React from 'react';
import Image from 'next/image';



import { ImageOutput } from '@/schema/outputTypeSchema/ImageOutputSchema';
import { LikeIcon } from '../Icon/LikeIcon';
import { ShareIcon } from '../Icon/ShareIcon';

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
                            {/* <FLike className="mr-2" /> */}
                            <LikeIcon/>
                            {image.favorite}
                        </button>
                        <button
                            className="px-6 py-2 rounded-full transform transition-transform hover:scale-105 flex items-center"
                            onClick={() => handleClickShare(image.id)}
                        >
                            <ShareIcon/>
                            Share
                        </button>
                    </div>
                </div>
                <div className="md:w-1/3 px-4 py-4">
                    <h2 className="text-xl font-bold">{image.description}</h2>
                   
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
                           
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Detail;

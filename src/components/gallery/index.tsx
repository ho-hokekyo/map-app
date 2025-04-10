'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ImageOutput } from '@/schema/outputTypeSchema/ImageOutputSchema';
import Image from 'next/image';

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState<ImageOutput | null>(null);
    const [images, setImages] = useState<ImageOutput[]>([]);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                fetch('/api/image/getImages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        num: 30,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setImages(data);
                    });
            } catch (error) {
                console.log('Failed to fecth images', error);
            }
        };

        fetchImage();
    }, []);

    return (
        <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
                {images.map((image: ImageOutput) => (
                    <div
                        key={image.id}
                        className="relative cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                    >
                        <Image
                            src={image.generatedUrl}
                            alt="Gallery"
                            className="w-full h-auto aspect-square object-cover rounded-md"
                            width={300}
                            height={300}
                            loading="lazy"
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="flex items-center text-white text-lg font-semibold">
                                <FavoriteIcon className="w-6 h-6 mr-2" />
                                {image.id}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 詳細ビュー */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="bg-white p-4 rounded-lg shadow-lg max-w-md"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage.generatedUrl}
                                alt="Detail"
                                className="w-full h-auto rounded-md"
                                width={400}
                                height={400}
                                loading="lazy"
                            />
                            <div className="mt-3">
                                <p className="text-gray-700">
                                    📍 {selectedImage.latitude}, {selectedImage.longitude}
                                </p>
                                <p className="text-gray-700">👤 {selectedImage.userId}</p>
                                <p className="text-gray-700">❤️ {selectedImage.id} Likes</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

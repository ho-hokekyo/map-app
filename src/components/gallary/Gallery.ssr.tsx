'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ImageOutput } from "@/schema/outputTypeSchema/ImageOutputSchema";
import Image from "next/image";

type Props = {
  initialImages: ImageOutput[];
};

const Gallery = ({ initialImages }: Props) => {
  const [selectedImage, setSelectedImage] = useState<ImageOutput | null>(null);
  const [images, setImages] = useState<ImageOutput[]>(initialImages);

  // 画像を動的に更新する場合、useEffectを使う
  useEffect(() => {
    // 動的に画像リストを更新する場合に実行される
    setImages(initialImages);
  }, [initialImages]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
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
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center text-white text-lg font-semibold">
                <FavoriteIcon className="w-6 h-6 mr-2" />
                {image.favorite}
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
              <img
                src={selectedImage.generatedUrl}
                alt="Detail"
                className="w-full h-auto rounded-md"
              />
              <div className="mt-3">
                <p className="text-gray-700">📍 {selectedImage.latitude}, {selectedImage.longitude}</p>
                <p className="text-gray-700">👤 {selectedImage.userId}</p>
                <p className="text-gray-700">❤️ {selectedImage.favorite} Likes</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

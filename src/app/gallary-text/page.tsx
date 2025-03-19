"use client";
import React, { useState, useEffect } from "react";
import { ImageOutput } from "@/schema/outputTypeSchema/ImageOutputSchema";

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState<ImageOutput | null>(null);
    const [images, setImages] = useState<ImageOutput[]>([]);

    useEffect(() => {

      const fetchImage = async () => {
        try{
          fetch("/api/image/getImages",{
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
        }catch(error){
          console.log("Failed to fecth images", error);
        }
      }

      fetchImage();

    }, []);

  return (
    <>
      {images.map((image: ImageOutput) => (
        <div key={image.id}>{image.generatedUrl}</div>
      ))}
    </>
  )
}
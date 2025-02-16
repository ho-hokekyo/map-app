'use client';

import { LatLngExpression } from 'leaflet';
import Image from 'next/image';
import { useState } from 'react';
import { MapContainer, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = () => {
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            // console.log('Location Found:', e.latlng);
        },
    });

    return position === null ? null : (
        <Popup
            position={position}
            closeButton={false}
            closeOnClick={false}
            closeOnEscapeKey={false}
        >
            You are here
        </Popup>
    );
};

const GeneratePage = () => {
    const [image, setImage] = useState<string>('');

    const LoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file: Blob = e.target.files[0];
        if (typeof window !== 'undefined') {
            setImage(window.URL.createObjectURL(file));
        }
    };

    const position: LatLngExpression = [51.505, -0.09];

    return (
        <>
            <div className="h-screen w-full bg-violet-50 overflow-y-auto bg-gradient-to-b from-gray-900 to-black text-white">
                <div className="md:flex">
                    <div className="md:w-1/2 p-4">
                        <input
                            type="text"
                            className="block w-full mb-2 p-2 text-sm text-whitesmoke border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                            placeholder="タイトルを入力してください"
                        />
                        <div className="md:h-[80vh] mt-[0.5rem] bg-gray-200">
                            {image ? (
                                <Image
                                    src={image}
                                    alt="Uploaded Image"
                                    layout="responsive"
                                    width={300}
                                    height={300}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
                                    <label
                                        htmlFor="dropzone-file"
                                        className="h-full aspect-square flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{' '}
                                                or drag and drop
                                            </p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => LoadFile(e)}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 p-4">
                        <p className="block mb-2 text-sm text-center font-medium text-whitesmoke">
                            マップをクリックして現在地を取得してください
                        </p>
                        <MapContainer
                            center={position}
                            zoom={13}
                            scrollWheelZoom={false}
                            className="w-full h-[30vh] md:h-[80vh] z-[1] border border-gray-300 rounded-lg"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            <LocationMarker />
                        </MapContainer>
                    </div>
                </div>
                <button
                    className="block w-[95%] m-auto p-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                    onClick={() => {
                        const imgElement = document.getElementById(
                            'uploadedImage',
                        ) as HTMLImageElement;
                        const locationInput = document.querySelector(
                            'input[type="text"]',
                        ) as HTMLInputElement;
                        const commentTextarea = document.querySelector(
                            'textarea',
                        ) as HTMLTextAreaElement;

                        if (imgElement && locationInput && commentTextarea) {
                            const imageData = imgElement.src;
                            const location = locationInput.value;
                            const comment = commentTextarea.value;

                            console.log('Image Data:', imageData);
                            console.log('Location:', location);
                            console.log('Comment:', comment);
                        }
                    }}
                >
                    アップロード
                </button>
            </div>
        </>
    );
};

export default GeneratePage;

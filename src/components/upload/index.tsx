import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import SimpleMap from './SimpleMap';
import Image from 'next/image';

import { UploadIcon } from '@/components/Icon/UploadIcon';

const UploadPage = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();

    const { location, error: locationError } = useGeoLocation();
    const [title, setTitle] = useState<string>('');

    // ファイルが選択された時の処理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);

            // 画像ファイルのみフィルタリング
            const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'));

            if (imageFiles.length === 0) {
                setError('please choose photo');
                setFiles([]);
                setPreview(null);
            } else {
                setFiles(imageFiles);
                setError(null);

                // 最初の画像ファイルのプレビューを設定
                const objectURL = URL.createObjectURL(imageFiles[0]);
                setPreview(objectURL);
            }
        }
    };

    // ドラッグ＆ドロップの処理
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedFiles = e.dataTransfer.files;
        const fileArray = Array.from(selectedFiles);

        // 画像ファイルのみフィルタリング
        const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            setError('画像ファイルをドラッグ＆ドロップしてください');
            setFiles([]);
            setPreview(null);
        } else {
            setFiles(imageFiles);
            setError(null);

            // 最初の画像ファイルのプレビューを設定
            const objectURL = URL.createObjectURL(imageFiles[0]);
            setPreview(objectURL);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('ファイルを選択してください');
            return;
        }

        setUploading(true);
        setError(null);

        // アップロード処理（例）
        try {
            //型のチェックをしたあとpostして, optimistic update( mainへ遷移する)
            // await new Promise((resolve) => setTimeout(resolve, 2000)); // 模擬的に2秒待つ
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('title', title);
            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());

            const res = fetch('/api/map/postMapImage', {
                method: 'POST',
                body: formData, // add location, title, session
            });
            // const
            router.push('/');

            setFiles([]);
            setPreview(null);
            // alert('ファイルアップロード成功');
        } catch (err) {
            setError('アップロード中にエラーが発生しました');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="w-full h-lvh flex items-center justify-center bg-gray-950">
                <div className="w-3/4 mt-8 mx-8">
                    <div
                        className="border border-dashed border-gray-400 rounded-lg p-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <label
                            htmlFor="file-upload"
                            className="block text-center text-gray-600 cursor-pointer"
                        >
                            {files.length === 0 ? (
                                // <UploadIcon className="w-full h-full"/>
                                <div className="w-full h-full mx-auto">
                                    <UploadIcon className="w-24 h-24 mx-auto" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* <p className="text-xl">選択された画像:</p> */}
                                    <div className="flex justify-center">
                                        {preview && (
                                            <Image
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-md max-h-3/4"
                                                width={200}
                                                height={200}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    {/* タイトル */}
                    <div className="mt-4">
                        <label htmlFor="title" className="block mt-4 text-gray-100">
                            You can add title.
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-900 text-gray-100 border border-violet-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
                        />
                    </div>

                    {/* 位置情報 */}
                    <div className="mt-4">
                        <SimpleMap location={location} error={locationError} />
                    </div>

                    <div className="mt-4 flex justify-between items-center mb-20">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`${
                                uploading
                                    ? 'bg-violet-400 cursor-not-allowed'
                                    : ' bg-violet-700 rounded hover:bg-violet-600 active:bg-violet-500 active:scale-105'
                            } w-full text-white px-6 py-2 rounded-md`}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;

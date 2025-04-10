import { ImageOutput } from '@/schema/outputTypeSchema/ImageOutputSchema';
import Image from 'next/image';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import { useMemo } from 'react';

type ImageMarkerProps = {
    image: ImageOutput;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleSelectedImage: (imageId: string) => void;
};

export const ImageMarker: React.FC<ImageMarkerProps> = ({
    image,
    setShow,
    handleSelectedImage,
}) => {
    const handleClicked = () => {
        setShow(true);
        handleSelectedImage(image.id);
    };

    const customIcon = useMemo(() => {
        const div = document.createElement('div');
        div.className =
            'relative w-[50px] h-[50px] rounded-full overflow-hidden shadow-lg border-1 border-violet-600 hover:border-violet-800 hover:border-4 hover:scale-105 transition-transform active:scale-125';

        const root = createRoot(div);
        root.render(
            <Image
                src={image.generatedUrl}
                alt={image.description ?? 'Image'}
                width={30}
                height={30}
                className="object-cover w-full h-full z-50"
                onClick={handleClicked}
            />,
        );

        return L.divIcon({
            html: div,
            iconAnchor: [0, 0],
            iconSize: [0, 0],
        });
    }, [image.generatedUrl]);

    return <Marker position={[image.latitude, image.longitude]} icon={customIcon} />;
};

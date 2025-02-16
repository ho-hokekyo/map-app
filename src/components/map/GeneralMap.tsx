import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useState } from 'react';
import Image from 'next/image';

import { CommonModal } from '../modal/CommonModal';

//mapに関するcssを管理
import './general-map.css';
import Detail from './Detail';

const GeneralMap: React.FC = () => {
    const [show, setShow] = useState(false);
    const position: LatLngExpression = [51.505, -0.09];
    // 初期マップズームレベル
    const zoom = 13;

    return (
        <>
            <MapContainer center={position} zoom={zoom}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Popup
                    position={position}
                    closeButton={false}
                    closeOnClick={false}
                    closeOnEscapeKey={false}
                >
                    <Image
                        src={'/map.png'}
                        width={300}
                        height={300}
                        alt="Map"
                        layout="responsive"
                        objectFit="cover"
                        onClick={() => setShow(!show)}
                    />
                </Popup>

                <CommonModal
                    isOpen={show}
                    closeModal={() => setShow(false)}
                    elem={
                        <Detail
                            map={'/map.png'}
                            title="title"
                            author="author"
                            address="address"
                            date="2025/01/01"
                            comment="comment"
                        />
                    }
                />
            </MapContainer>
        </>
    );
};

export default GeneralMap;

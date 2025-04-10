import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 📌 カスタムマーカーアイコン
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// 📌 クリックでマーカーを追加するコンポーネント
function ClickableMap({ addMarker }: { addMarker: (pos: [number, number]) => void }) {
    useMapEvents({
        click: (e) => {
            addMarker([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export const MapDemo = () => {
    const [markers, setMarkers] = useState<[number, number][]>([[35.6895, 139.6917]]); // 初期位置: 東京

    // 📌 マーカーを追加
    const addMarker = (pos: [number, number]) => {
        setMarkers([...markers, pos]);
    };

    return (
        <div className="w-full h-screen">
            <MapContainer center={[35.6895, 139.6917]} zoom={13} className="w-full h-full">
                {/* タイルレイヤー（マップの背景） */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* 固定マーカー（初期マーカー + 追加したマーカー） */}
                {markers.map((pos, idx) => (
                    <Marker key={idx} position={pos} icon={customIcon}>
                        <Popup>
                            📍 緯度: {pos[0]}
                            <br />
                            📍 経度: {pos[1]}
                        </Popup>
                    </Marker>
                ))}

                {/* クリックでマーカーを追加 */}
                <ClickableMap addMarker={addMarker} />
            </MapContainer>
        </div>
    );
};

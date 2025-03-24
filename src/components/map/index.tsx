"use client"
import { MapContainer, TileLayer} from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { CommonModal } from '../modal/CommonModal';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import Detail from './Detail';
import { UserMarker } from './UserMarker';
import { ImageMarker } from './ImageMarker';
import { ImageOutput } from '@/schema/outputTypeSchema/ImageOutputSchema';
import { useMapEvents } from 'react-leaflet/hooks';
import { fetchSquareImages, fetchSelectedImage } from './action';


export const MapComponent = ({setImages}: { setImages: React.Dispatch<React.SetStateAction<ImageOutput[]>> }) => {
  
    const fetchImages = async () => {
      try{
        const latlangBounds = map.getBounds();
        const minLatitude = latlangBounds.getSouthWest().lat;
        const maxLatitude = latlangBounds.getNorthEast().lat;
        const minLongitude = latlangBounds.getSouthWest().lng;
        const maxLongitude = latlangBounds.getNorthEast().lng;
        const zoom = map.getZoom();
        
        const data = await fetchSquareImages(minLatitude, maxLatitude, minLongitude, maxLongitude, zoom);
        setImages(data);
        
      }catch(error){
        console.log(error);

      } 
    }
    
    // 地図のインタラクションに関するイベント
    // マップが読み込まれたとき、ドラッグが終了したとき、ズームが終了したときに画像を取得する
    const map  = useMapEvents({
      click: () => {
        map.locate()
        const latlangBounds = map.getBounds();
      },
      
      loading: () => {
        console.log("load");
        fetchImages();
      },
      dragend: () => {
        console.log("dragend");
        console.log(map.getCenter());
        fetchImages();
      },
      zoomend: () => {
        console.log("zoomend");
        fetchImages();
        
      }
    })

    useEffect(() => {
      fetchImages();
    }, []);
    return null;
  }

const Map = () => {
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageOutput | null>(null);
    // 初期マップズームレベル
    const [zoom, setZoom] = useState<number>(13);
    // const {location, error} = useGeoLocation();
    const [position, setPosition] = useState<LatLngTuple>([35.681236, 139.767125]);

    const [images, setImages] = useState<ImageOutput[]>([]);
    const {location, error} = useGeoLocation();

    const handleReset = () =>{
      setPosition([35.681236, 139.767125]);
    }

    const handleSelect = async (imageId: string) => {
      const fetchedImage = await fetchSelectedImage(imageId);
      setSelectedImage(fetchedImage);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            console.log("location found");
          navigator.geolocation.getCurrentPosition((pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
          });
        }else{
            console.log("location not found");
        }
    }, []);

    return (
    <>
        <div className="w-full h-screen z-0">
            <MapContainer key={`${location.latitude}`} center={[location.latitude, location.longitude]} zoom={zoom} className="w-full h-full z-0">
                
                <MapComponent setImages={setImages}/>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
        
                {images.map((image: ImageOutput) => (
                  <ImageMarker key={image.id} image={image} setShow={setShow} handleSelectedImage={handleSelect}/>
                ))}
                  
                  <UserMarker position={[location.latitude, location.longitude]} />

                <CommonModal
                    isOpen={show}
                    closeModal={() => setShow(false)}
                    elem={
                        selectedImage ? <Detail
                       image={selectedImage}
                    /> : <></>    
                    }
                    /> 
            </MapContainer>
        </div>
      </>
    );
};

export default Map;

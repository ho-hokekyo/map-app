"use client";
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { Icon, LatLng, LatLngExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import Image  from 'next/image';
import { CommonModal } from '../modal/CommonModal';
import L from "leaflet";

import {useMapEvents} from 'react-leaflet/hooks';
import { useGeoLocation } from '@/hooks/useGeoLocation';
// import './general-map.css';
import Detail from './Detail';
import { LocationIcon } from '@/components/Icon/LocationIcon';

import {ImageOutput} from '@/schema/outputTypeSchema/ImageOutputSchema';
import { createRoot } from "react-dom/client";

const MapCompoent = ({setImages}: { setImages: React.Dispatch<React.SetStateAction<ImageOutput[]>> }) => {
  
    const fetchImage = async () => {
      try{
        const latlangBounds = map.getBounds();
        const minLatitude = latlangBounds.getSouthWest().lat;
        const maxLatitude = latlangBounds.getNorthEast().lat;
        const minLongitude = latlangBounds.getSouthWest().lng;
        const maxLongitude = latlangBounds.getNorthEast().lng;
        const zoom = map.getZoom();
        console.log(minLatitude, maxLatitude, minLongitude, maxLongitude, zoom);
        fetch('/api/map/getSquareMapImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            minLatitude,
            maxLatitude,
            minLongitude,
            maxLongitude,
            zoom,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setImages(data);
          });
      }catch(error){
        console.log(error);

      } 
    }

    const map  = useMapEvents({
      click: () => {
        map.locate()
        console.log(map.getCenter());
        // get lat and long of square
        const latlangBounds = map.getBounds();
        console.log(latlangBounds.getNorthWest());
        console.log(latlangBounds.getNorthEast());
        
  
      },
      loading: () => {
        console.log("load");
        fetchImage();
      },
      dragend: () => {
        console.log("dragend");
        console.log(map.getCenter());
        fetchImage();
      },
      zoomend: () => {
        console.log("zoomend");
        fetchImage();
        
      }
      
    })

    useEffect(() => {
      fetchImage();
    }, []);
    return null;
  }

  type ImageMarkerProps = {
    image: ImageOutput;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedImage: React.Dispatch<React.SetStateAction<ImageOutput | null>>;
  };
  
  const ImageMarker2: React.FC<ImageMarkerProps> = ({ image, setShow, setSelectedImage }) => {
    const handleClicked = () => {
      setShow(true);
      setSelectedImage(image);
    }
    
    const customIcon = useMemo(() => {
      const div = document.createElement("div");
      div.className = "relative w-[50px] h-[50px] rounded-full overflow-hidden shadow-lg border-1 border-violet-600 hover:border-violet-800 hover:border-4 hover:scale-105 transition-transform active:scale-125";
  
      const root = createRoot(div);
      root.render(
        <Image
          src={image.generatedUrl}
          alt={image.description ?? "Image"}
          width={30}
          height={30}
          className="object-cover w-full h-full z-50"
          onClick={handleClicked}
        />
      );
  
      return L.divIcon({
        html: div,
        // iconSize: [100, 30],
        iconAnchor: [0, 0],
        iconSize: [0, 0],
        // popupAnchor: [0, -50],
        
      });
    }, [image.generatedUrl]);
  
    return <Marker position={[image.latitude, image.longitude]} icon={customIcon} />;
  };

  const UserMarker = ({ position }: { position: LatLngTuple }) => {
    const customIcon = useMemo(() => {
      const div = document.createElement("div");
      div.className = "relative w-[50px] h-[50px] ";
  
      const root = createRoot(div);
      root.render(
        <LocationIcon className="w-12 h-12 z-100 shadow-sm"></LocationIcon>
      );
  
      return L.divIcon({
        html: div,
  
        iconAnchor: [12, 24],
        iconSize: [0, 0],
   
        
      });
    }, []);
  
    return <Marker position={position} icon={customIcon} zIndexOffset={100}/>;

  }


const GeneralMap = () => {
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

    return (<>
        <div className="w-full h-screen z-0">
        {/* <button onClick={handleReset} className="absolute top-30 left-30 bg-white p-2 rounded-full shadow-md">Reset</button> */}
            <MapContainer key={`${location.latitude}`} center={[location.latitude, location.longitude]} zoom={zoom} className="w-full h-full z-0">
                
                <MapCompoent setImages={setImages}/>
                <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          />
                {/* <Popup
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
                </Popup>  */}
                
                {images.map((image: ImageOutput) => (
                  <ImageMarker2 key={image.id} image={image} setShow={setShow} setSelectedImage={setSelectedImage}/>
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

export default GeneralMap;

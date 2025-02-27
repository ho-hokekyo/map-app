"use client";
import { useState, useEffect} from 'react';

type GeoLocationPosition = {
    latitude: number;
    longitude: number;
}

export const useGeoLocation = (interval: number = 5000) => {
    const defaultLocation = {
        // tokyo
        latitude: 35.6895,
        longitude: 139.6917
    }
    const [location, setLocation] = useState<GeoLocationPosition>(defaultLocation);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported.');
            return;
        }

        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                }
            )
        }

        updatePosition();
        const intervalId = setInterval(updatePosition, interval);

        return () => clearInterval(intervalId);
    }, [interval])
    

    return { location, error };


}





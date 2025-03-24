
type SimpleMapProps = {
    location: {
        latitude: number;
        longitude: number;
    };
    error: string | null;
}

const SimpleMap = ({ location }: SimpleMapProps) => {
    return (
        <div className="text-white">
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
        </div>
    );
};

export default SimpleMap;

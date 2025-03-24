import { useMemo } from "react"; 
import { Marker } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import { LocationIcon } from "@/components/Icon/LocationIcon";
import { createRoot } from "react-dom/client";
 
type UserMarkerProps = {
    position: LatLngTuple;
};
export const UserMarker = ({ position }: UserMarkerProps) => {
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
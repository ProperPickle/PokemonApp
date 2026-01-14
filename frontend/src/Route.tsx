/* global google */
/// <reference types="google.maps" />
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useMemo, useRef} from "react";

interface RouteProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  onDistanceCalculated?: (distanceKm: number) => void;
}

const RouteOnMap = ({ origin : {lat: originLat, lng: originLng}, destination, onDistanceCalculated }: RouteProps) => {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const COOLDOWN_MS = 3000; // 1 second cooldown

  const originPos = useMemo(() => 
    originLat != null && !(originLat === 0 && originLng === 0) ? new google.maps.LatLng(originLat, originLng) : null,
  [originLat, originLng]
  );
  const destinationPos = useMemo(() => 
    new google.maps.LatLng(destination.lat, destination.lng),
  [destination.lat, destination.lng]
  );
  
  useEffect(() => {
    if (!map || !originPos || !destinationPos) {
      // Cleanup
      polyline?.setMap(null);
      setPolyline(null);
      return;
    }

    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;
    
    if (timeSinceLastCall < COOLDOWN_MS) {
      return;
    }
    
    lastCallTimeRef.current = now;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: originPos,
        destination: destinationPos,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const routePath = result.routes[0].overview_path;
          
          const newPolyline = new google.maps.Polyline({
            path: routePath,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 6,
          });
          
          newPolyline.setMap(map);

          const distanceMeters = result.routes[0].legs.reduce((total, leg) => total + (leg.distance?.value || 0), 0);

          if (onDistanceCalculated) {
            onDistanceCalculated(distanceMeters);
          }

          polyline?.setMap(null);  // Remove old
          setPolyline(newPolyline);
        }
      }
    );

    return () => {
      polyline?.setMap(null);
    };
  }, [map, originPos, destinationPos, onDistanceCalculated]);

  return null;  // Polyline renders via imperative API
};

export default RouteOnMap;
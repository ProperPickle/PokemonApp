/* global google */
/// <reference types="google.maps" />
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

interface RouteProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number };
  onDistanceCalculated?: (distanceKm: number) => void;
}

const RouteOnMap = ({ origin, destination, onDistanceCalculated }: RouteProps) => {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !origin || !destination) {
      // Cleanup
      polyline?.setMap(null);
      setPolyline(null);
      return;
    }

    const service = new google.maps.DirectionsService();
    const originPos = new google.maps.LatLng(origin.lat, origin.lng);
    const destinationPos = new google.maps.LatLng(destination.lat, destination.lng);

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
  }, [map, origin, destination]);

  return null;  // Polyline renders via imperative API
};

export default RouteOnMap;
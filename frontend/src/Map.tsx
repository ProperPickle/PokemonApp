import api from './Api_Interceptor';
import React, {useEffect, useState, useRef} from 'react';
import {AdvancedMarker, APIProvider, Map, MapCameraChangedEvent, useMap} from '@vis.gl/react-google-maps'
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import './Map.css';
import RouteOnMap from './Route';

// Describe the shape of each detail item so TS knows name/type exist
type LatLng = { lat: number; lng: number };

interface Detail {
  id: number;
  lat: number;
  long: number;
  loc: string;
  moves: string[];
  sprite: string;
  name: string;
  type: string;
}

interface MapComponentProps {
  onPokemonClick: (pokemon: Detail) => void;
  onDistanceCalculated?: (distanceKm: number) => void;
  currPokemon: Detail | null;
  routeOrigin: LatLng;
}

const MapComponent = ({onPokemonClick, onDistanceCalculated, currPokemon, routeOrigin}: MapComponentProps) => {
  const [details, setDetails] = React.useState<Detail[]>([]);
  
  useEffect(() => {
    api.get(`/api/pokemon/`)
      .then(res => {
        setDetails(res.data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY} libraries={["geometry"]} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        className="map-container"
        defaultZoom={15}
        mapId = {import.meta.env.VITE_MAPS_ID}
        defaultCenter={{lat: 34.0699, lng: -118.4438}}
        onCameraChanged={ (ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }>
        <MapCameraController currPokemon={currPokemon} />
        <PoiMarkers pois={details} onPokemonClick={onPokemonClick} />
        <RouteOnMap origin={routeOrigin} destination={{ lat: 34.0699, lng: -118.4438 }} onDistanceCalculated={onDistanceCalculated} />
      </Map>
    </APIProvider>
  );
};

const MapCameraController = ({currPokemon}: {currPokemon: Detail | null}) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !currPokemon) return;
    map.panTo({lat: Number(currPokemon.lat), lng: Number(currPokemon.long)});
  }, [map, currPokemon]);
  
  return null;
};
const PoiMarkers = (props: {pois: Detail[], onPokemonClick: (pokemon: Detail) => void}) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
    const clusterer = useRef<MarkerClusterer | null>(null);
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
           clusterer.current = new MarkerClusterer({map}); 
        }   
    }, [map]);
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);
    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };
    return(
      <>
        {props.pois.map((poi: Detail) => (
            <AdvancedMarker
            key={poi.id}
            position={{ lat: Number(poi.lat), lng: Number(poi.long) }}
            ref={marker => setMarkerRef(marker, poi.id.toString())}
            >
              <img src={poi.sprite} alt={poi.name} onClick={() => {
                props.onPokemonClick(poi);
              }}/>
            </AdvancedMarker>
        ))}
      </>
    );
};

export default MapComponent;

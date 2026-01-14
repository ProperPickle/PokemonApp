import React from 'react';
import FileInputPopup from './FileInputPopup';
import Popup from './Popup';
import MapComponent from './Map';
import PokemonInfoPopup from './PokemonInfoPopup';
import PokemonList from './PokemonList';
import './App.css';
import Logout from './Logout';

// Describe the shape of each detail item so TS knows name/type exist
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

type LatLng = { lat: number; lng: number };

const App = () => {
  const [popupIsOpen, setPopupIsOpen] = React.useState(false);
  const [activePokemon, setActivePokemon] = React.useState<Detail | null>(null);
  const [pokemonPopupIsOpen, setPokemonPopupIsOpen] = React.useState(false);
  const [routeOrigin, setRouteOrigin] = React.useState<LatLng>({ lat: 0, lng: 0 });
  const [routeDistance, setRouteDistance] = React.useState<number | null>(null);

  return (
      <div className = "app-container">
        <div className = "sidebar"> 
          <button
            onClick={() => setPopupIsOpen(true)}
            className="create-button"
          >
            Upload CSV
          </button>
          <PokemonList onPokemonClick={(pokemon) => {
            setActivePokemon(pokemon);
            setPokemonPopupIsOpen(true);
          }}></PokemonList>
        </div>
        <Popup isOpen={popupIsOpen} onClose={() => setPopupIsOpen(false)}>
          <FileInputPopup />
        </Popup>
        <Popup isOpen={pokemonPopupIsOpen} onClose={() => setPokemonPopupIsOpen(false)} >
          <PokemonInfoPopup pokemon={activePokemon} onNavigate={(lat, long) => setRouteOrigin({ lat, lng: long })} routeDistance={routeDistance} parentShowDistance={pokemonPopupIsOpen} />
        </Popup>
        <div className="topbar">
          <Logout />
        </div>
        <div className="map-container">
          <MapComponent onPokemonClick={(pokemon) => {
            setActivePokemon(pokemon);
            setPokemonPopupIsOpen(true);
          }} currPokemon={activePokemon} routeOrigin={routeOrigin} onDistanceCalculated={(distanceKm) => setRouteDistance(distanceKm)} />
        </div>        
          {/*details.map((output) => (
            <div key = {output.id}>
              <div>
                <h2>{output.name}</h2>
                <h3>{output.type}</h3>
                <h4>{output.lat}, {output.long}</h4>
              </div>
            </div>
          ))*/}
        </div>
  );
};

export default App;

import React, { useEffect } from 'react';
import api from './Api_Interceptor';
import './PokemonList.css';

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

const PokemonList = ({onPokemonClick}: {onPokemonClick: (pokemon: Detail) => void}) => {
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
        <div className = "pokemon-list">
        {details.map((output) => (
            <div key = {output.id} onClick={() => {
                onPokemonClick(output);
              }} className="pokemon-list-element">
                <h3>{output.name} - {output.id}</h3>
                <img src={output.sprite} alt={output.name}/>
                
            </div>
        ))}
        </div>
    );
}

export default PokemonList;
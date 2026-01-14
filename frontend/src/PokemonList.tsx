import React, { useEffect, useState } from 'react';
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
function usePersistentFavorite(key: string, initialValue: number) {
  const [favorite, setFavorite] = useState<number>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? Number(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, String(favorite));
  }, [key, favorite]);

  return [favorite, setFavorite] as const;
}

function isFavValid(fav: number, details: Detail[]) {
  return details.some(detail => detail.id === fav);
}

const PokemonListItem = ({detail, onPokemonClick, favorite}: {detail: Detail, onPokemonClick: (pokemon: Detail) => void, favorite?: boolean}) => (
  <div onClick={() => {
      onPokemonClick(detail);
    }} className="pokemon-list-element">
      <h3>{detail.name} - {detail.id} - {favorite ? "⭐" : ""}</h3>
      <img src={detail.sprite} alt={detail.name}/>
  </div>
);
const PokemonList = ({onPokemonClick}: {onPokemonClick: (pokemon: Detail) => void}) => {
    const [details, setDetails] = useState<Detail[]>([]);
    const [favorite, setFavorite] = usePersistentFavorite('favoritePokemon', -1);
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
        {isFavValid(favorite, details) && <PokemonListItem detail={details.find(d => d.id === favorite)!} onPokemonClick={onPokemonClick} favorite={true} />}
        {details.map((output) => (
          (output.id !== favorite) && <PokemonListItem detail={output} onPokemonClick={onPokemonClick} key={output.id} />
        ))}
        </div>
    );
}

export default PokemonList;
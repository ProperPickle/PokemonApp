import './Popup.css';
import React, { useEffect, useState } from 'react';
import api from './Api_Interceptor';
import {PokemonStats} from "./PokemonStats";
import { PokemonFromApi } from "./PokemonFromApi";

interface PokemonInfoPopupProps {
    pokemon: {
        id: number;
        lat: number;
        long: number;
        loc: string;
        moves: string[];
        sprite: string;
        name: string;
        type: string;
    } | null;
    onNavigate: (lat: number, long: number) => void;
    routeDistance?: number | null;
    parentShowDistance ?: boolean;
}

const PokemonInfoPopup = ({ pokemon, onNavigate, routeDistance, parentShowDistance }: PokemonInfoPopupProps) => {
    const [showDistance, setShowDistance] = useState(false);
    const [pokemonFromPage, setPokemonFromPage] = useState<PokemonFromApi | null>(null);
    useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon?.name.toLowerCase()}`)
        .then((res) => res.json())
        .then(setPokemonFromPage);
    }, [pokemon?.name]);
    useEffect(() => {
        setShowDistance(false);
    }, [parentShowDistance]);

    return (
        <div className="pokemon-info-window">
            {pokemonFromPage && <PokemonStats pokemon={pokemonFromPage} />}
            <button onClick = {(event) => { 
                event.preventDefault();
                if(pokemon) {
                    onNavigate(pokemon.lat, pokemon.long);
                    setShowDistance(true);
                }
            }}>How far am I from home?</button>
            <p>{showDistance && routeDistance !== null && routeDistance !== undefined ? `Distance: ${(routeDistance / 1000).toFixed(2)} km` : ""}</p>
            <button onClick = {(event) => { 
                event.preventDefault();
                if(pokemon) {
                    api.delete(`/api/pokemon/${pokemon.id}/`)
                    .then(response => {
                        console.log("Pokemon released:", response.data);
                    })
                    .catch(error => {
                        console.error("Error releasing Pokemon:", error);
                    });
                }
            }}>Release this Pokemon</button>
        </div>
    );
}

export default PokemonInfoPopup;
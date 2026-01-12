interface PokemonFromApi {
  height: number;
  weight: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default: string | null;
      };
    };
  };
  species: {
    name: string;
    url: string;
  }
  location_area_encounters: string;
  stats: {
    base_stat: number;
    stat: { name: string };  // "hp", "attack", "defense", "special-attack", "special-defense", "speed"
  }[];
  types: {
    slot: number;
    type: { name: string };  // "fire", "water", etc.
  }[];
}

interface PokemonSpeciesFromApi {
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  is_legendary: boolean;
  is_mythical: boolean;
}

interface PokemonLocationsFromApi {
  location_area: {
    name: string;
    url: string;
  };
} 




export {PokemonFromApi, PokemonSpeciesFromApi, PokemonLocationsFromApi}
import { PokemonFromApi, PokemonSpeciesFromApi, PokemonLocationsFromApi} from "./PokemonFromApi.tsx";
import {useEffect, useState} from "react";

interface PokemonStatsProps {
  pokemon: PokemonFromApi;
}

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  const [speciesFromPokemon, setSpeciesFromPokemon] = useState<PokemonSpeciesFromApi | null>(null);
  const [locationsFromPokemon, setLocationsFromPokemon] = useState<PokemonLocationsFromApi[] | null>(null);
  // Prefer official artwork, fall back to front_default
  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default ??
    "";
  useEffect(() => {
      fetch(pokemon.species.url)
          .then((res) => res.json())
          .then(setSpeciesFromPokemon);
      }, [pokemon?.name, pokemon?.species.url]);

  useEffect(() => {
      fetch(pokemon.location_area_encounters)
          .then((res) => res.json())
          .then(setLocationsFromPokemon);
      }, [pokemon?.name, pokemon?.location_area_encounters]);

  function getFlavorText(species: PokemonSpeciesFromApi): string {
    const entry = species.flavor_text_entries.find(
      e => e.language.name === "en"
    );
    if (!entry) return "No description available";
    return entry.flavor_text.replace(/[\n\f]/g, " ").trim();
  }
  const flavorText = speciesFromPokemon ? getFlavorText(speciesFromPokemon) : "Loading description...";

  function getLocationText(locations: PokemonLocationsFromApi[]): string {
    if (!locations) return "No location data available";
    const locationNames = locations[0].location_area.name.replace(/-/g, " ");
    return locationNames;
  }

  const locationText = locationsFromPokemon ? getLocationText(locationsFromPokemon) : "Loading location data...";

  const getStat = (name: string) =>
    pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  const hp = getStat("hp");
  const attack = getStat("attack");
  const defense = getStat("defense");
  const spAttack = getStat("special-attack");
  const spDefense = getStat("special-defense");
  const speed = getStat("speed");

  // Convert Pokédex units: height in decimeters, weight in hectograms
  const heightM = (pokemon.height / 10).toFixed(2);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  const types = pokemon.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name);

  return (
    <div style={{ padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
      {/* Header: sprite, name, types */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {sprite && (
          <img
            src={sprite}
            alt={pokemon.name}
            style={{ width: 72, height: 72 }}
          />
        )}
        <div>
          <h2
            style={{
              margin: 0,
              textTransform: "capitalize",
              fontSize: "1.4rem",
            }}
          >
            {pokemon.name}, {locationText}
          </h2>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            {types.map((type) => (
              <span
                key={type}
                style={{
                  background: "#edf2f7",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  textTransform: "capitalize",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: "1rem", fontStyle: "italic", maxWidth: "300px", maxHeight: "200px", fontSize: "0.9rem", overflowY: "auto" }}>{flavorText}</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          padding: "0.75rem",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        }}
      >
        <MeasurementCard
          label="Height"
          primary={`${heightM} m`}
          secondary={`${pokemon.height} dm`}
        />
        <MeasurementCard
          label="Weight"
          primary={`${weightKg} kg`}
          secondary={`${pokemon.weight} hg`}
        />
      </div>
      {/* Base stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <StatRow label="HP" value={hp} />
        <StatRow label="Attack" value={attack} />
        <StatRow label="Defense" value={defense} />
        <StatRow label="Sp. Atk" value={spAttack} />
        <StatRow label="Sp. Def" value={spDefense} />
        <StatRow label="Speed" value={speed} />
      </div>
    </div>
  );
}

function MeasurementCard({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "0.75rem 0.9rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.8rem",
          color: "#4a5568",
          marginBottom: "0.35rem",
          background: "#edf2f7",
          padding: "0.15rem 0.5rem",
          borderRadius: "999px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 600, color: "#1a202c" }}>
        {primary}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#4a5568" }}>{secondary}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  const percentage = Math.min((value / 180) * 100, 100); // 180-ish is a strong stat

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          marginBottom: "0.1rem",
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div
        style={{
          background: "#e2e8f0",
          height: "8px",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background:
              percentage > 70
                ? "#48bb78"
                : percentage > 40
                ? "#ecc94b"
                : "#f56565",
            transition: "width 0.25s ease",
          }}
        />
      </div>
    </div>
  );
}

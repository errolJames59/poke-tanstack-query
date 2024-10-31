import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loader";

const Pokemons = () => {
  const [page, setPage] = useState(0);

  // Fetch basic Pokemon data
  const fetchPokemons = async (page = 0) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${page * 20}&limit=20`
    );
    const data = await response.json();
    return data;
  };

  // Main Pokemon query to get list of Pokemon names and URLs
  const { error, data, isPlaceholderData } = useQuery({
    queryKey: ["pokemon", page],
    queryFn: () => fetchPokemons(page),
    placeholderData: keepPreviousData,
  });

  // Fetch sprite for a single Pokemon
  const fetchSprites = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data.sprites.front_default;
  };

  // Query to fetch each Pokemon's sprite
  const pokemonWithSpritesQuery = useQuery({
    queryKey: ["pokemonWithSprites", page],
    queryFn: async () => {
      const results = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const sprite = await fetchSprites(pokemon.url);
          return { ...pokemon, sprite };
        })
      );
      return results;
    },
    placeholderData: keepPreviousData,
    enabled: !!data && !!data.results,
  });

  const { isFetching, isPending } = pokemonWithSpritesQuery;

  const pokemonWithSprites = pokemonWithSpritesQuery.data;

  if (error) {
    return <div>Error loading pokemon: {error.message}</div>;
  }

  return (
    <section className="flex flex-col gap-4 place-items-center min-h-screen">
      <h1 className="font-bold">Pokemons</h1>

      {isPending ? (
        <div className="flex gap-4">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {pokemonWithSprites &&
              pokemonWithSprites.map((pokemon, index) => (
                <Card key={index} className="text-center cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-light font-mono">
                      {pokemon.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={pokemon.sprite}
                      alt={`${pokemon.name} sprite`}
                      className="w-20 h-20 mx-auto"
                    />
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="flex flex-col place-items-center gap-4">
            <span>Current Page: {page + 1}</span>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setPage((old) => Math.max(old - 1, 0));
                }}
                disabled={page === 0}
              >
                Previous Page
              </Button>
              <Button
                onClick={() => {
                  if (!isPlaceholderData && data?.next) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={isPlaceholderData || !data?.next}
              >
                Next Page
              </Button>
            </div>

            {isFetching ? (
              <span className="flex gap-4">
                <LoadingSpinner />
              </span>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default Pokemons;

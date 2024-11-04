import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loader";

const Pokemons = () => {
  const [page, setPage] = useState(0);

  // Fetch basic Pokemon data
  const fetchPokemons = async (page = 0) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${page * 40}&limit=40`
    );
    const data = await response.json();
    return data;
  };

  // Main Pokemon query to get list of Pokemon names and URLs
  const { error, data } = useQuery({
    queryKey: ["pokemon", page],
    queryFn: () => fetchPokemons(page),
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
    enabled: !!data && !!data.results,
  });

  const { isFetching, isPending } = pokemonWithSpritesQuery;

  const pokemonWithSprites = pokemonWithSpritesQuery.data;

  useEffect(() => {
    if (!isPending) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isPending]);

  if (error) {
    return <div>Error fetching Pokemons: {error.message}</div>;
  }

  return (
    <section className="flex flex-col gap-4 place-items-center min-h-screen">
      {isPending ? (
        <div className="flex gap-4 my-auto">
          <img
            src="./pokemon.svg"
            className="animate-spin"
            width={20}
          />
          <span>Fetching Pokemons...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-center">Pokemons</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pokemonWithSprites &&
              pokemonWithSprites.map((pokemon, index) => (
                <Card key={index} className="text-center cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-light font-mono">
                      {pokemon.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={pokemon.sprite} className="w-24 h-24 mx-auto" />
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
                  if (!isPending && data?.next) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={isPending || !data?.next}
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

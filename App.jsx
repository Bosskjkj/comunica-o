import { useState } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarPokemons = async () => {
    setLoading(true);
    setErro(null);

    try {
      const resposta = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=12"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar lista");
      }

      const data = await resposta.json();

      const detalhes = await Promise.all(
        data.results.map(async (poke) => {
          const res = await fetch(poke.url);
          return res.json();
        })
      );

      setPokemons(detalhes);
    } catch (error) {
      setErro("Erro ao carregar Pokémons 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>⚡ Pokédex</h1>

      <p className="descricao">
        React (cliente) consumindo dados da PokéAPI (servidor).
      </p>

      <button onClick={buscarPokemons} disabled={loading}>
        {loading ? "Carregando..." : "Buscar Pokémons"}
      </button>

      {erro && <p className="erro">{erro}</p>}

      {!loading && pokemons.length === 0 && !erro && (
        <p className="vazio">Clique para carregar os Pokémons</p>
      )}

      {loading && <div className="loader"></div>}

      <div className="lista">
        {pokemons.map((poke) => (
          <div key={poke.id} className="card">
            <img
              src={poke.sprites.front_default}
              alt={poke.name}
            />

            <h3>{poke.name.toUpperCase()}</h3>

            <p>
              <strong>Tipos:</strong>{" "}
              {poke.types.map((t) => t.type.name).join(", ")}
            </p>

            <p>
              <strong>Habilidades:</strong>{" "}
              {poke.abilities.map((a) => a.ability.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
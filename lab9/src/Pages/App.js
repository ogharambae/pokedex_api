import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
            .then((d) => d.data)
            .then((d) => {
                setPokemons(d);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div>

        </div>
    )
}

export default App

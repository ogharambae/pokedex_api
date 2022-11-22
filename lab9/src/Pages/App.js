import React, { useEffect, useState } from "react";
import Page from "../Components/Page"
import axios from "axios";

function App() {
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

    const [pokemons, setPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const howManyPerPage = 10;
    const indexLowerBound = currentPage * howManyPerPage;
    const indexUpperBound = indexLowerBound - howManyPerPage;
    const currentPokemons = pokemons.slice(indexUpperBound, indexLowerBound)
    const numPages = Math.ceil(pokemons.length / howManyPerPage);

    return (
        <div>
            <Page currentPage={currentPage} currentPokemons={currentPokemons} />
        </div>
    )
}

export default App

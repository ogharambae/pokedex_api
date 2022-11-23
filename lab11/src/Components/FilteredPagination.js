import React, { useEffect, useState } from "react"
import Page from "./Page";
import Pagination from './Pagination';
import axios from 'axios'

function FilteredPagination({ types, checkedState }) {
    const [pokemons, setPokemons] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const howManyPerPage = 10;

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            .then(res => res.data)
            .then(data => {
                console.log(checkedState);
                data = (data.filter(pokemon => checkedState.every((checked, i) => !checked || pokemon.type.includes(types.current[i]))
                ))
                return data
            })
            .then(res => {
                setPokemons(res)
            })
            .catch(err => console.log(err))
    }, [checkedState])

    const indexLowerBound = currentPage * howManyPerPage
    const indexUpperBound = indexLowerBound - howManyPerPage
    const currentPokemons = pokemons.slice(indexUpperBound, indexLowerBound)
    const numPages = Math.ceil(pokemons.length) / howManyPerPage;

    return (
        <>
            < Page currentPage={currentPage} currentPokemons={currentPokemons} />
            < Pagination
                numPages={numPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    )
}

export default FilteredPagination
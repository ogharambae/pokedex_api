import React, { useEffect, useState } from "react"
import Page from "./Page";
import Pagination from './Pagination';
import axios from "axios";
import { Box, Typography, Grid } from "@mui/material";


function FilteredPagination({ types, checkedState }) {
    const [pokemons, setPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const howManyPerPage = 10;

    useEffect(() => {
        async function getPokemons() {
            const API_URL = "http://localhost:8000/api/v1"
            await axios.get(`${API_URL}/pokemons`, {
                withCredentials: true
            })
                .then((d) => (d).data)
                .then((d) => {
                    d = (d.filter((pokemon) => checkedState.every((checked, i) => !checked || pokemon.type.includes(types.current[i]))
                    ));
                    return d;
                })
                .then((d) => {
                    setPokemons((d));
                })
                .catch(err => console.log(err))
        }
        getPokemons();
    }, [checkedState, types]);

    const indexLowerBound = currentPage * howManyPerPage;
    const indexUpperBound = indexLowerBound - howManyPerPage;
    const currentPokemons = pokemons.slice(indexUpperBound, indexLowerBound);
    const numPages = Math.ceil(pokemons.length) / howManyPerPage;;

    return (
        <div>
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                justifyContent="center">
                <Typography
                    variant="h2"
                    fontFamily={"PixGamer"}
                    fontWeight="bold">
                    Page number {currentPage}
                </Typography>
            </Box>
            <Box
                display={"flex"}>
                <Page currentPokemons={currentPokemons} />
            </Box>
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                justifyContent="center">
                <Pagination
                    numPages={numPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Box>
        </div >
    )
}

export default FilteredPagination
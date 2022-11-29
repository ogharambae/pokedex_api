import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button } from "@mui/material";
import PokedexDialog from "../components/PokedexDialog";

function Pokemon({ pokemon }) {
    const [currentPokemonInfo, setCurrentPokemonInfo] = useState([]);
    const [show, setShow] = useState(false);

    const getPokemonInfo = async (e) => {
        e.preventDefault();
        const API_URL = "http://localhost:8000/api/v1/pokemon"
        await axios.get(`${API_URL}/${pokemon.id}`, {
            withCredentials: true
        }).then(({ data: resData }) => {
            setCurrentPokemonInfo(resData[0]);
            setShow(true);
        }).catch((err) => {
            console.log(err);
        });
    }

    const generateId = (id) => {
        if (id < 10) {
            return `00${id}`
        }
        if (id < 100) {
            return `0${id}`
        }
        return id;
    }
    return (
        <div>
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                justifyContent="center"
                width={300}>
                <img
                    src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${generateId(pokemon.id)}.png`}
                    alt={`place ${pokemon.name.english} here`}
                    width="200" />
                <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    style={{ fontFamily: "PixGamer", backgroundColor: "rgba(38, 99, 213, 0.8)" }}
                    onClick={getPokemonInfo}>
                    show detail
                </Button>
                {show && <PokedexDialog pokemon={currentPokemonInfo} setShow={setShow} />}
            </Box>
        </div>
    )
}

export default Pokemon

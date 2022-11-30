import React from 'react'

function Pokemon({ pokemon }) {
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
            <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${generateId(pokemon.id)}.png`} alt={`place ${pokemon.name.english} here`} />
        </div>
    )
}

export default Pokemon

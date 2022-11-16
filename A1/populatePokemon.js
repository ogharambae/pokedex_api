// const axios = require("axios")
// const mongoose = require("mongoose")
// const { asyncWrapper } = require("./asyncWrapper")


// const populatePokemon = asyncWrapper(async () => {
    
//     let pokemonModel = null;

//     const pokeRes = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
//     if (!pokeRes || !pokeRes.data || pokeRes.status != 200) {
//         throw new Error("Error: could not load pokemon data.")
//     }

//     const pokemonData = pokeRes.data.map((d) => {
//         d.base["Speed Attack"] = d.base["Sp. Attack"];
//         d.base["Speed Defense"] = d.base["Sp. Defense"];
//         return d;
//     })

//     const typeRes = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json")
//     if (!typeRes || !typeRes.data || typeRes.status != 200) {
//         throw new Error("Error: could not load types data.")
//     }
//     const types = typeRes.data.map(typeData => typeData.english)

//     const { Schema } = mongoose;
//     const pokemonSchema = new Schema({
//         "id": Number,
//         "name": {
//             "english": {
//                 type: String,
//                 required: true,
//                 maxLength: 20
//             },
//             "japanese": String,
//             "chinese": String,
//             "french": String
//         },
//         "type": {
//             "type": [String],
//             "enum": types
//         }
//         ,
//         "base": {
//             "HP": Number,
//             "Attack": Number,
//             "Defense": Number,
//             "Speed Attack": Number,
//             "Speed Defense": Number,
//             "Speed": Number
//         }
//     })
//     pokemonModel = await mongoose.model('pokemons', pokemonSchema);
//     await pokemonModel.create(pokemonData)
// })
// module.exports = { populatePokemon }
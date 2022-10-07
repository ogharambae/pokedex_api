const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')

const app = express()
const port = 5000

let pokemonModel = null;

app.listen(port, async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test')
        await mongoose.connection.db.dropDatabase();

        const pokeRes = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
        if (!pokeRes || !pokeRes.data || pokeRes.status != 200) {
            throw new Error("Error: could not load pokemon data.")
        }

        const typeRes = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json")
        if (!typeRes || !typeRes.data || typeRes.status != 200) {
            throw new Error("Error: could not load types data.")
        }
        const types = typeRes.data.map(typeData => typeData.english)

        const { Schema } = mongoose;
        const pokemonSchema = new Schema({
            "id": Number,
            "name": {
                "english": String,
                "japanese": String,
                "chinese": String,
                "french": String
            },
            "type": {
                "type": [String],
                "enum": types
            }
            ,
            "base": {
                "HP": Number,
                "Attack": Number,
                "Defense": Number,
                "Sp. Attack": Number,
                "Sp. Defense": Number,
                "Speed": Number
            }
        })
        pokemonModel = mongoose.model('pokemons', pokemonSchema);
        await pokemonModel.create(pokeRes.data)

    } catch (error) {
        console.log('Error populating db')
    }

    // app.get('/api/v1/pokemons?count=2&after=10')     // - get all the pokemons after the 10th. List only Two.
    // app.post('/api/v1/pokemon')                      // - create a new pokemon
    // app.get('/api/v1/pokemon/:id')                   // - get a pokemon
    // app.get('/api/v1/pokemonImage/:id')              // - get a pokemon Image URL
    // app.put('/api/v1/pokemon/:id')                   // - upsert a whole pokemon document
    // app.patch('/api/v1/pokemon/:id')                 // - patch a pokemon document or a portion of the pokemon document
    // app.delete('/api/v1/pokemon/:id')                // - delete a  pokemon 
})


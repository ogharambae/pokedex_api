const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const e = require('express')

const app = express()
const port = 5000

let pokemonModel = null;

app.listen(process.env.PORT || port, async () => {
    try {
        await mongoose.connect('mongodb+srv://hyunbae:BK2FeIG9GpvBFiTj@cluster0.cnjwrfq.mongodb.net/a1?retryWrites=true&w=majority')
        // await mongoose.connection.db.dropDatabase();

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
                "english": {
                    type: String,
                    required: true,
                    maxLength: 20
                },
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
})

app.use(express.json())

// - get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons', (req, res) => {
    let query = pokemonModel.find({}).sort('id');

    if (req.query.after) {
        query = query.skip(req.query.after);
    }

    if (req.query.count) {
        query = query.limit(req.query.count);
    }
    query.exec().then((pokeDoc) => {
        if (pokeDoc.length > 0) {
            res.json(pokeDoc);
        } else {
            res.send({ errMsg: "Error: no pokemon(s) found. Please check your params again." });
        }
    })
})

// - get a pokemon
app.get('/api/v1/pokemon/:id', (req, res) => {
    pokemonModel.find({ id: req.params.id })
        .then(pokeDoc => {
            if (pokeDoc.length > 0) {
                res.json(pokeDoc)
            } else {
                res.send({ errMsg: "Error: no pokemon found with specified id. Please check your id again." })
            }
        })
        .catch(err => {
            console.log(err);
            res.send({ errMsg: "Cast Error: pokemon id must be between 1 and 809." })
        })
})

// - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', (req, res) => {
    let id = req.params.id;
    res.json({ url: "https://github.com/fanzeyi/pokemon.json/blob/master/images/" + id + ".png" })
})

// - create a new pokemon
app.post('/api/v1/pokemon', (req, res) => {
    pokemonModel.find({ id: req.body.id })
        .then(pokeDoc => {
            if (pokeDoc.length > 0) {
                res.send({ errMsg: "Pokemon with that ID already exists." })
            } else {
                pokemonModel.create(req.body, function (err) {
                    if (err) {
                        res.send({ errMsg: "ValidationError: check your values to see if they match the specifications of the schema." })
                    } else {
                        res.send({ msg: "Pokemon created successfully." })
                    }
                })
            }
        }).catch(err => {
            console.log(err);
            res.send({ errMsg: "Error: database reading error. Check with server devs." })
        })
})

// - upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', (req, res) => {
    const { _id, ...rest } = req.body;
    pokemonModel.findOneAndUpdate({ id: req.params.id }, { $set: { ...rest } }, { runValidators: true, upsert: true }, function (err, doc) {
        if (err) {
            res.send({ errMsg: "ValidationError: check your values to see if they match the specifications of the schema." })
        } else {
            res.json({ msg: "Pokemon upserted successfully.", data: doc })

        }
    });
})

// - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', (req, res) => {
    const { _id, ...rest } = req.body;
    pokemonModel.findOneAndUpdate({ id: req.params.id }, { $set: { ...rest } }, { runValidators: true }, function (err, doc) {
        if (err) {
            res.send({ errMsg: "ValidationError: check your values to see if they match the specifications of the schema." })
        } else {
            res.json({ msg: "Pokemon updated successfully.", data: doc })
        }
    });
})

// - delete a pokemon 
app.delete('/api/v1/pokemon/:id', (req, res) => {
    pokemonModel.find({ id: req.params.id })
        .then(pokeDoc => {
            if (pokeDoc.length > 0) {
                pokemonModel.deleteOne({ id: req.params.id }, function (err, result) {
                    if (err) console.log(err);
                });
                res.send({ msg: "Deleted pokemon successfully." })
            } else {
                res.send({ errMsg: "Error: pokemon not found." })
            }
        })
})

app.get('*', (req, res) => {
    res.send({ errMsg: "Improper route. Check API docs plz." })
})
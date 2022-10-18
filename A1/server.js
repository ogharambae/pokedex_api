const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const e = require('express')
const { response } = require('express')

const app = express()
const port = 5000

let pokemonModel = null;

app.listen(process.env.PORT || port, async () => {
    try {
        await mongoose.connect('mongodb+srv://hyunbae:BK2FeIG9GpvBFiTj@cluster0.cnjwrfq.mongodb.net/a1?retryWrites=true&w=majority')
        await mongoose.connection.db.dropCollection("pokemons");

        const pokeRes = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
        if (!pokeRes || !pokeRes.data || pokeRes.status != 200) {
            throw new Error("Error: could not load pokemon data.")
        }

        const pokemonData = pokeRes.data.map((d) => {
            d.base["Speed Attack"] = d.base["Sp. Attack"];
            d.base["Speed Defense"] = d.base["Sp. Defense"];
            return d;
        })

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
                "Speed Attack": Number,
                "Speed Defense": Number,
                "Speed": Number
            }
        })
        pokemonModel = mongoose.model('pokemons', pokemonSchema);

        await pokemonModel.create(pokemonData)
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

function paramHandler(req, res, next) {
    let check = req.query;

    const validParams = [
        "base",
        "name",
        "id",
        "type",
        "filteredProperty",
        "name.english",
        "name.chinese",
        "name.japanese",
        "name.french",
        "base.HP",
        "base.Attack",
        "base.Speed Attack",
        "base.Speed Defense",
        "base.Speed",
        "page",
        "hitsPerPage",
        "sort"
    ];
    Object.keys(check)
        .forEach((k) => {
            if (!validParams.includes(k)) {
                res.send({ errMsg: "Error: Invalid parameter. Please double check your parameter names." });
                return;
            }
        })
    next();
}

function pageHandler(req, res, next) {
    let check = req.query.page;
    let checkTwo = req.query.hitsPerPage;
    if (check && isNaN(check)) {
        res.send({ errMsg: "Error: page must be a number." })
        return;
    } else if (checkTwo && isNaN(checkTwo)) {
        res.send({ errMsg: "Error: hitsPerPage must be a number." })
        return;
    }
    next();
}

function typeHandler(req, res, next) {
    let check = req.query.type;
    if (check && isNaN(check)) {
        next();
    } else {
        res.send({ errMsg: "Error: type must be a string." });
        return;
    }
}

// function baseHandler(req, res, next) {
//     let check = req.query.base.HP;
//     console.log(check);
//     // check.forEach((e) => {
//     //     console.log(e);
//     //     if (e && isNaN(e)) {
//     //         res.send({ errMsg: "Error: base values be a number." })
//     //     }
//     // })
//     next();
// }

var errHandler = [paramHandler, pageHandler, typeHandler];

app.get('/pokemonsAdvancedFiltering', errHandler, async (req, res) => {
    let query = req.query;
    let { type, sort, page, hitsPerPage } = req.query

    if (type) {
        const types = query.type.split(',').map(item => item.trim());
        type = { $in: types };
    }

    let sortBy = {};

    if (sort) {
        query.sort.split(",")
            .map((s) => s.trim())
            .forEach((e) => {
                if (e[0] === '-') {
                    sortBy[e.substring(1)] == -1
                } else {
                    sortBy[e] = 1
                }
            });
    }

    let filterArr = {};

    if (query.filteredProperty) {
        filterArr = query.filteredProperty.split(',').map(item => item.trim());
    }

    if (page) {
        page = parseInt(page);
    } else {
        page = 1;
    }

    if (hitsPerPage) {
        hitsPerPage = parseInt(hitsPerPage);
    } else {
        hitsPerPage = 5;
    }

    const pokemon = await pokemonModel.find(query).sort(sortBy).select(filterArr).limit(page * hitsPerPage);

    res.send({
        hits: pokemon,
        page: query.page,
        numHits: pokemon.length,
        numPages: Math.ceil(pokemon.length / hitsPerPage),
        hitsPerPage: query.hitsPerPage,
        params: req.query
    });
})

app.get('*', (req, res) => {
    res.send({ errMsg: "Improper route. Check API docs plz." })
})
const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios")
const { asyncWrapper } = require("./asyncWrapper")
const { connectDB } = require("./connectDB")
const cookieParser = require("cookie-parser");
const {
    PokemonBadRequest,
    PokemonNotFound,
    PokemonImageNotFound,
    PokemonDb,
    PokemonDuplicate,
    PokemonMissingID,
    PokemonNoSuchRoute,
    PokemonNotFoundWithID,
    PokemonNoAdminAccess
} = require("./errors")
const dotenv = require("dotenv")
const userModel = require("./userModel")
const jwt = require("jsonwebtoken")

dotenv.config();
const app = express()
const port = 5000

let pokemonModel = null;

app.listen(process.env.pokeServerPort || port, async () => {
    try {
        await connectDB();

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
        pokemonModel = await mongoose.model('pokemons', pokemonSchema);
        await pokemonModel.create(pokemonData)

    } catch (error) {
        throw new PokemonDb(error);
    }
})

app.use(express.json())
app.use(cookieParser())

const auth = asyncWrapper(async (req, res, next) => {
    const authToken = req.cookies.auth_token;
    if (!authToken) {
        throw new PokemonBadRequest("Access denied.");
    }
    try {
        const token = req.header("auth_token");
        const userFound = await userModel.findOne({ token: token });
        if (!userFound) {
            throw new PokemonBadRequest("Access denied.");
        }
        next();
    } catch (err) {
        throw new PokemonBadRequest("Invalid token.")
    }
})

const isAdmin = asyncWrapper(async (req, res, next) => {
    const adminAccess = req.cookies.is_admin;
    if (adminAccess != "true") {
        throw new PokemonNoAdminAccess();
    }
    next();
})

app.use(auth)
// - get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
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
            // res.send({ errMsg: "Error: no pokemon(s) found. Please check your params again." });
            throw new PokemonNotFound();
        }
    });
}))

// - get a pokemon
app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
    if (!req.params.id) {
        throw new PokemonMissingID();
    }
    await pokemonModel.find({ id: req.params.id })
        .then(pokeDoc => {
            if (pokeDoc.length > 0) {
                res.json(pokeDoc)
            } else {
                // res.send({ errMsg: "Error: no pokemon found with specified id. Please check your id again." });
                throw new PokemonNotFoundWithID();
            }
        })
        .catch((err) => {
            // res.send({ errMsg: "Cast Error: pokemon id must be between 1 and 809." });
            throw new PokemonBadRequest(err);
        })
}))


app.use(isAdmin)
// - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', asyncWrapper(async (req, res) => {
    if (!req.params.id) {
        throw new PokemonMissingID();
    }
    try {
        let id = req.params.id;
        res.json({ url: "https://github.com/fanzeyi/pokemon.json/blob/master/images/" + id + ".png" });
    } catch (err) {
        throw new PokemonImageNotFound(err);
    }
}))

// - create a new pokemon
app.post('/api/v1/pokemon', asyncWrapper(async (req, res) => {
    await pokemonModel.find({ id: req.body.id })
        .then(pokeDoc => {
            if (pokeDoc.length > 0) {
                // res.send({ errMsg: "Pokemon with that ID already exists." })
                throw new PokemonDuplicate();
            } else {
                pokemonModel.create(req.body, function (err) {
                    if (err) {
                        throw new PokemonBadRequest(err);
                        // res.send({ errMsg: "ValidationError: check your values to see if they match the specifications of the schema." })
                    } else {
                        res.send({ msg: "Pokemon created successfully." })
                    }
                })
            }
        }).catch((err) => {
            // res.send({ errMsg: "Error: database reading error. Check with server devs." })
            throw new PokemonDb(err);
        })
}))

// - upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
    const selection = { id: req.params.id }
    const update = req.body
    const options = {
        new: true,
        runValidators: true,
        overwrite: true
    }
    const doc = await pokemonModel.findOneAndUpdate(selection, update, options);
    console.log(doc);
    if (doc) {
        res.json({ msg: "Pokemon upserted successfully.", data: doc })
    } else {
        throw new PokemonBadRequest();
    }
}))

// - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
    const selection = { id: req.params.id }
    const update = req.body
    const options = {
        new: true,
        runValidators: true
    }
    const doc = await pokemonModel.findOneAndUpdate(selection, update, options)
    if (doc) {
        res.json({
            msg: "Pokemon patched Successfully.",
            pokeInfo: doc
        })
    } else {
        throw new PokemonNotFound();
    }
}))

// - delete a pokemon 
app.delete('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
    await pokemonModel.find({ id: req.params.id })
        .then(pokeDoc => {
            if (pokeDoc.length > 0) {
                pokemonModel.deleteOne({ id: req.params.id }, function (err, result) {
                    if (err) console.log(err);
                });
                res.send({ msg: "Deleted pokemon successfully." })
            } else {
                throw new PokemonNotFound();
                // res.send({ errMsg: "Error: pokemon not found." })
            }
        })
}))

// function paramHandler(req, res, next) {
//     let check = req.query;

//     const validParams = [
//         "base",
//         "name",
//         "id",
//         "type",
//         "filteredProperty",
//         "name.english",
//         "name.chinese",
//         "name.japanese",
//         "name.french",
//         "base.HP",
//         "base.Attack",
//         "base.Speed Attack",
//         "base.Speed Defense",
//         "base.Speed",
//         "page",
//         "hitsPerPage",
//         "sort"
//     ];
//     Object.keys(check)
//         .forEach((k) => {
//             if (!validParams.includes(k)) {
//                 res.send({ errMsg: "Error: Invalid parameter. Please double check your parameter names." });
//                 return;
//             }
//         })
//     next();
// }

// function pageHandler(req, res, next) {
//     let check = req.query.page;
//     let checkTwo = req.query.hitsPerPage;
//     if (check && isNaN(check)) {
//         res.send({ errMsg: "Error: page must be a number." })
//         return;
//     } else if (checkTwo && isNaN(checkTwo)) {
//         res.send({ errMsg: "Error: hitsPerPage must be a number." })
//         return;
//     }
//     next();
// }

// function typeHandler(req, res, next) {
//     let check = req.query.type;
//     if (check && isNaN(check)) {
//         next();
//     } else {
//         res.send({ errMsg: "Error: type must be a string." });
//         return;
//     }
// }

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

// var errHandler = [paramHandler, pageHandler, typeHandler];

// app.get('/pokemonsAdvancedFiltering', async (req, res) => {
//     let query = req.query;
//     let { type, sort, page, hitsPerPage } = req.query

//     if (type) {
//         const types = query.type.split(',').map(item => item.trim());
//         type = { $in: types };
//     }

//     let sortBy = {};

//     if (sort) {
//         query.sort.split(",")
//             .map((s) => s.trim())
//             .forEach((e) => {
//                 if (e[0] === '-') {
//                     sortBy[e.substring(1)] == -1
//                 } else {
//                     sortBy[e] = 1
//                 }
//             });
//     }

//     let filterArr = {};

//     if (query.filteredProperty) {
//         filterArr = query.filteredProperty.split(',').map(item => item.trim());
//     }

//     if (page) {
//         page = parseInt(page);
//     } else {
//         page = 1;
//     }

//     if (hitsPerPage) {
//         hitsPerPage = parseInt(hitsPerPage);
//     } else {
//         hitsPerPage = 5;
//     }

//     const pokemon = await pokemonModel.find(query).sort(sortBy).select(filterArr).limit(page * hitsPerPage);

//     res.send({
//         hits: pokemon,
//         page: query.page,
//         numHits: pokemon.length,
//         numPages: Math.ceil(pokemon.length / hitsPerPage),
//         hitsPerPage: query.hitsPerPage,
//         params: req.query
//     });
// })

// app.get("/pokemonsAdvancedFiltering", async (req, res) => {

//     let query = {};
//     let operatorsBefore = {};
//     let stat = [];
//     let extractedOps = [];
//     let converted = [];
//     let value = [];

//     Object.keys(req.query).forEach((q) => {
//         if (q.includes("comparisonOperators")) {
//             operatorsBefore = req.query[q].split(",").map((operatorsBefore) => operatorsBefore.trim());
//             query[q] = { $in: operatorsBefore }
//         }
//     })
//     operatorsBefore.forEach((e) => {
//         extracted = e.split(/(<=|>=|==|!=|>|<)/g);
//         stat.push(extracted[0]);
//         extractedOps.push(extracted[1]);
//         value.push(extracted[2]);
//     })
//     extractedOps.forEach((e) => {
//         if (e == "<=") {
//             converted.push("$lte")
//         } else if (e == ">=") {
//             converted.push("$gte")
//         } else if (e == "==") {
//             converted.push("$eq")
//         } else if (e == "!=") {
//             converted.push("$ne")
//         } else if (e == ">") {
//             converted.push("$gt")
//         } else if (e == "<") {
//             converted.push("$lt")
//         }
//     })
//     console.log(stat);
//     console.log(converted);
//     console.log(value);
//     let result = await pokemonModel.find(
//         {
//             base: {
//                 stat: { converted: value }
//             },
//         }
//     )
//     res.send(result);
// })

// app.patch("/pokemonsAdvancedUpdate", async (req, res) => {
//     const { id, pushOperator } = req.query;

//     var cleaned = pushOperator.replace(/\[/g, '');
//     cleaned = cleaned.replace(/\]/g, '');
//     let types = cleaned.split(',').map(item => item.trim());
//     console.log(types);

//     await pokemonModel.findOneAndUpdate({ id: id }, { new: true, upsert: false, runValidators: true }, { $addToSet: { type: { $each: types } } });
//     res.send({ msg: "Updated pokemon." })
// })

app.get('*', (req, res) => {
    // res.send({ errMsg: "Improper route. Check API docs plz." })
    throw new PokemonNoSuchRoute();
})
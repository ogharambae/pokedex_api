const express = require("express");
const { connectDB } = require("./connectDB.js");
const { populatePokemons } = require("./populatePokemons.js");
const { getTypes } = require("./getTypes.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("./errors.js");
const { asyncWrapper } = require("./asyncWrapper.js");
const dotenv = require("dotenv");
const userModel = require("./userModel.js");

dotenv.config();
const app = express();
var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });
  const pokeSchema = await getTypes();
  pokeModel = await populatePokemons(pokeSchema);
  app.listen(process.env.pokeServerPORT, (err) => {
    if (err) {
      throw new PokemonDbError(err);
    } else {
      console.log(`Server is running on port: ${process.env.pokeServerPORT}`);
    }
  })
})
start();

app.use(express.json());
app.use(cookieParser());

const auth = asyncWrapper(async (req, res, next) => {
  const authToken = req.cookies.auth_token;
  if (!authToken) {
    throw new PokemonAuthError("Access denied.");
  }
  try {
    const token = req.header("auth_token");
    const userFound = await userModel.findOne({ token: token });
    if (!userFound) {
      throw new PokemonAuthError("Access denied.");
    }
    next();
  } catch (err) {
    throw new PokemonAuthError("Invalid token.")
  }
})

const isAdmin = asyncWrapper(async (req, res, next) => {
  const adminAccess = req.cookies.is_admin;
  if (adminAccess != "true") {
    throw new PokemonAuthError("You do not have admin access.");
  }
  next();
})

app.use(cors());
app.use(auth);

// get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  let query = pokeModel.find({}).sort('id');
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
      throw new PokemonNotFoundError();
    }
  });
}))

// get a pokemon
app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    throw new PokemonMissingID();
  }
  await pokeModel.find({ id: req.params.id })
    .then(pokeDoc => {
      if (pokeDoc.length > 0) {
        res.json(pokeDoc)
      } else {
        throw new PokemonBadRequest();
      }
    })
    .catch((err) => {
      throw new PokemonBadRequest(err);
    })
}))

app.use(isAdmin);
app.get('/api/v1/pokemonImage/:id', asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    throw new PokemonBadRequestMissingID();
  }
  try {
    let id = req.params.id;
    res.json({ url: "https://github.com/fanzeyi/pokemon.json/blob/master/images/" + id + ".png" });
  } catch (err) {
    throw new PokemonBadRequest(err);
  }
}))

// create a new pokemon
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  console.log(req.body);
  if (!req.body.id) {
    throw new PokemonBadRequestMissingID();
  }

  const poke = await pokeModel.find({ "id": req.body.id });
  if (poke.length != 0) {
    throw new PokemonDuplicateError();
  }

  const pokeDoc = await pokeModel.create(req.body);
  res.json({ msg: "Added Successfully", pokeInfo: pokeDoc });
}))

// delete a pokemon
app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs) {
    res.json({ msg: "Deleted Successfully" });
  }
  else {
    throw new PokemonNotFoundError("");
  }
}))

// upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  const selection = { id: req.params.id };
  const update = req.body;
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  };
  const pokeDoc = await pokeModel.findOneAndUpdate(selection, update, options);
  if (pokeDoc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: pokeDoc
    });
  } else {
    throw new PokemonNotFoundError("");
  }
}))

// patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  const selection = { id: req.params.id };
  const update = req.body;
  const options = {
    new: true,
    runValidators: true
  };
  const doc = await pokeModel.findOneAndUpdate(selection, update, options);
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    throw new PokemonNotFoundError("");
  }
}))

app.get("*", (req, res) => {
  throw new PokemonNoSuchRouteError("");
})

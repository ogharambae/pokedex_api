const { connectDB } = require("./database/connectDB");
const { populatePokemons } = require("./database/populatePokemons");
const { getTypes } = require("./database/getTypes");
const { asyncWrapper } = require("./utility/asyncWrapper");
const userModel = require("./database/userModel");
const express = require("express");
const apiUserStatModel = require("./database/apiStatUserModel");
const topUserEndpointModel = require("./database/topUserEndpointSchema");
const routeAccessLogModel = require("./database/routeAccessLogSchema");
const { logUniqueAPIUsers, logTopUserByEndpoint, logRouteAccess } = require("./utility/loggerLogic");
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("./utility/errors");

const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}


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

// authentication logic
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
    morgan.token('username', (req, res) => { return JSON.stringify(req.cookies['username']) })
    next();
  } catch (err) {
    throw new PokemonAuthError("Invalid token.");
  }
})

// logic to check if current user is admin
const isAdmin = asyncWrapper(async (req, res, next) => {
  const adminAccess = req.cookies.is_admin;
  if (adminAccess != "true") {
    throw new PokemonAuthError("You do not have admin access.");
  }
  next();
})

app.use(morgan(async (token, req, res) => {
  const usernameStringified = token.username(req, res);
  const username = usernameStringified.replace(/\"/g, "");

  const endpoint = token.url(req, res);
  const method = token.method(req, res);
  const status = token.status(req, res);

  logUniqueAPIUsers(username);
  logTopUserByEndpoint(endpoint, username);
  logRouteAccess(endpoint, status, method);
}));

app.use(cors(corsOptions));
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

// get api stats 
app.get('/userApi', asyncWrapper(async (req, res) => {
  const userApiData = await apiUserStatModel.find({});
  const userEndpointData = await topUserEndpointModel.find({});
  const accessRouteLogs = await routeAccessLogModel.find({})
  res.send({ userApiData, userEndpointData, accessRouteLogs });
}))

app.get("*", (req, res) => {
  throw new PokemonNoSuchRouteError("");
})

const { asyncWrapper } = require("./utility/asyncWrapper");
const userModel = require("./database/userModel.js");
const { connectDB } = require("./database/connectDB");
const {
  PokemonBadRequest,
  PokemonDbError,
} = require("./utility/errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
dotenv.config();
const cookieTTL = 100 * 60 * 60 * 8;

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });
  app.listen(process.env.authServerPORT, async (err) => {
    if (err) {
      throw new PokemonDbError(err);
    }
    else {
      console.log(`Server is running on port: ${process.env.authServerPORT}`);
    }
    const doc = await userModel.findOne({ "username": "admin" });
    if (!doc)
      userModel.create({ username: "admin", password: bcrypt.hashSync("admin", 10), role: "admin", email: "admin@admin.ca" })
  })
})
start();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use(session({
  secret: "thisIsASecretCode",
  saveUninitialized: true,
  cookie: { maxAge: cookieTTL },
  resave: false
}));

// registers user
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body;
  const checkUser = await userModel.findOne({ username });
  if (checkUser) {
    // console.log("sending invalid response...");
    res.send({
      data: username,
      msg: "Account with that username already exists.",
      errorCode: 101
    })
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, salt);
    const userWithHashedPW = { ...req.body, password: hashedPW };
    const user = await userModel.create(userWithHashedPW);
    // console.log(user);
    res.send({
      data: user
    });
  }
}))

// login for a user
app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });

  if (!user) {
    res.send({
      data: username,
      msg: "No user found with username " + username,
      errorCode: 500
    })
    // throw new PokemonBadRequest("User not found.");
  } else {
    const isPWCorrect = await bcrypt.compare(password, user.password);
    if (!isPWCorrect) {
      res.send({
        data: username,
        msg: "Password is incorrect.",
        errorCode: 501
      })
      // throw new PokemonBadRequest("Password is incorrect.");
    } else {
      // create a cookie, attach token to cookie, assign the token to the user in mongodb
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      if (user.is_admin == "true") { // if admin, set is_admin to "true"
        res.cookie("is_admin", "true");
      } else {
        res.cookie("is_admin", "false");
      }
      res.cookie("auth_token", token, { maxAge: 2 * 60 * 60 * 1000 });
      const header = res.header("auth_token", token);
      await userModel.findOneAndUpdate({ username }, { token: token });
      console.log(user);
      res.send({
        data: user
      });
    }
  }
}))

// Logout and clear a token
app.get("/logout", asyncWrapper(async (req, res) => {
  res.clearCookie("auth_token");
  res.clearCookie("is_admin");
  res.json({ Message: "You have been successfully logged out." });
}));

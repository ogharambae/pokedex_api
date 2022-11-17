const express = require("express")
const {
    PokemonBadRequest,
    PokemonDb
} = require("./errors")
const { asyncWrapper } = require("./asyncWrapper")
const { connectAuth } = require("./connectAuth")
const dotenv = require("dotenv")
const userModel = require("./userModel")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express();
dotenv.config();

const start = async () => {
    await connectAuth();
    app.listen(process.env.authServerPORT, (err) => {
        if (err)
            throw new PokemonDb(err)
        else
            console.log(`Server is running on port: ${process.env.authServerPORT}`);
    })
}
start()

app.use(express.json())
app.use(cookieParser())

app.post('/register', asyncWrapper(async (req, res) => {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, salt);
    const userWithHashedPW = { ...req.body, password: hashedPW };
    const user = await userModel.create(userWithHashedPW);
    res.send(user);
}))

// login for a user
app.post('/login', asyncWrapper(async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
        throw new PokemonBadRequest("User not found.");
    }
    const isPWCorrect = await bcrypt.compare(password, user.password);
    if (!isPWCorrect) {
        throw new PokemonBadRequest("Password is incorrect.");
    }
    // create a cookie
    // attach token to cookie
    // assign the token to the user in mongodb
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.cookie("auth_token", token, { maxAge: 2 * 60 * 60 * 1000 });
    await userModel.findOneAndUpdate({ username }, { token: token });
    // res.header("auth-token", token);
    res.send(user);
}))

// Logout and clear a token
app.get("/logout", asyncWrapper(async (req, res) => {
    res.clearCookie("token");
    res.json({ Message: "Logged out" });
})
);
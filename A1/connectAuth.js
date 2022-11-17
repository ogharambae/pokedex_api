const { mongoose } = require("mongoose")
const { PokemonDb } = require("./errors")
const dotenv = require("dotenv")
dotenv.config();


const connectAuth = async () => {
    try {
        await mongoose.connect(process.env.DB_STRING);
        await mongoose.connection.db.dropCollection("pokeusers");
    } catch (err) {
        throw new PokemonDb(err);
    }
}

module.exports = { connectAuth }
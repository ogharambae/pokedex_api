const { mongoose } = require("mongoose")
const { PokemonDb } = require("./errors")
const dotenv = require("dotenv")
dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_STRING);
        await mongoose.connection.db.dropCollection("pokemons");
    } catch (err) {
        throw new PokemonDb(err);
    }
}

module.exports = { connectDB }
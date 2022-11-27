const { mongoose } = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async (input) => {
  try {
    await mongoose.connect(process.env.DB_STRING);
    console.log("Connected to db");
    if (input.drop === true)
      mongoose.connection.db.dropDatabase();
  } catch (error) {
    console.log("Database error...");
  }
}

module.exports = { connectDB }
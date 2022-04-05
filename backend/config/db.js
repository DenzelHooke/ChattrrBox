const mongoose = require("mongoose");

async function connectDB() {
  // Connects to mongo database when called.

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Connected to MongoDB: ${conn.connection.host}`.bgGreen.black);
  } catch (error) {
    console.log(`Error with mongoDB connection: ${error}`.bgWhite.red);
    process.exit(1);
  }
}

module.exports = {
  connectDB,
};

require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/app");

mongoose.set("strictQuery", false);

const { HOST_URI, PORT } = process.env;

(async function () {
  try {
    const connection = await mongoose.connect(HOST_URI);
    console.log("Database connection successful");
    return connection;
  } catch (error) {
    console.error("SERVER CONECTION ERROR: ", error.message);
    process.exit(1);
  }
})()
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`),
  );

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

const contactRouter = require("./routes/contacts");
const userRouter = require("./routes/users");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));

app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(err.code || 500).json({ message: err.message });
});

module.exports = app;

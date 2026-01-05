const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("=====UNCAUGHT EXCEPTION! 💥 Shutting down=====");
  console.log(err.name, err.message);
  process.exit(1);
});

// mongoose connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.log(error);
  });

// server setup
const port = process.env.PORT || 3010;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("warning", (e) => console.warn(e.stack));

// SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    console.log("Server closed.");
    process.exit(1);
  }
});

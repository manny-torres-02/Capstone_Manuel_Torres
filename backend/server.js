import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import volunteers from "./routes/volunteers.js";
import events from "./routes/events.js";
import db from "./knexconfig.js"; //TODO: Remove if unneeded.
import categories from "./routes/categories.js";

dotenv.config();

const port = process.env.PORT || 8080;
// const port = 8080;
//TODO: uncomment once the db works
// const DB_HOST = process.env.DB_HOST || "http://localhost";
// const express = require("express");
const app = express();

const { CORS_ORIGIN } = process.env;

const logRequest = (req, res, next) => {
  console.log(`Request: ${req.method} for ${req.path}`);
  next();
};

// TODO: Evaluate whehter ot not we need to place static assets here
// app.use('/static', express.static('public'))
// dotenv.config();

app.use(cors({ origin: CORS_ORIGIN }));
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

app.use(express.json());

app.use(logRequest);

app.get("/", (req, res) => {
  res.send("TEST FROM UPDATED test");
});

app.use("/volunteers", volunteers);

app.use("/events", events);

app.use("/categories", categories);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

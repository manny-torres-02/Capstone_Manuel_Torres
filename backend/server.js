import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// const port = process.env.PORT || 8080;
const port = 8080;
//TODO: uncomment once the db works
// const DB_HOST = process.env.DB_HOST || "http://localhost";
// const express = require("express");
const app = express();

// TODO: Evaluate whehter ot not we need to place static assets here
// app.use('/static', express.static('public'))
// dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TEST FROM UPDATED SERVER");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

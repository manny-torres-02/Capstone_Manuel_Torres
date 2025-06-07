const express = require("express");
const router = express.Router();
const emailService = require("../services/emailService");
const knex = require("knex")(require("../knexfile"));

// route to send emails
router.post("/send", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

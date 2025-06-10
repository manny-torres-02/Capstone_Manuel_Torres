import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await knex("categories").select("*");

    res.json(categories);
  } catch (err) {
    res.status(400).send(`Error retrieving categories: ${err}`);
  }
});

router.post("/", async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const [categoryId] = await knex("categories").insert({
      name,
      description,
    });

    res.status(201).json({
      id: categoryId,
      name,
      description,
      success: true,
    });
  } catch (err) {
    console.error("Category creation error:", err);
    res.status(500).json({
      error: "Category creation failed",
      details: err.message,
    });
  }
});

router.delete("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  let trx;

  try {
    trx = await knex.transaction();

    //1. delete entries from junction tables
    //Since the these are the linked tables, need to always manage these first.
    await trx("volunteer_categories").where("category_id", categoryId).del();
    await trx("event_categories").where("category_id", categoryId).del();

    // 2.Then delete the category itself.
    const deleteCount = await trx("categories").where("id", categoryId).del();

    if (deleteCount === 0) {
      await trx.rollback();
      return res
        .status(404)
        .json({ error: `Category ${categoryId} not found` });
    }

    await trx.commit();
    //delete successfully.
    res.sendStatus(204);
  } catch (error) {
    if (trx) await trx.rollback();
    console.error(`Delete failed for category ${categoryId}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

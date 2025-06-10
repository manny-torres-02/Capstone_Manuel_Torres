import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import express from "express";
const router = express.Router();

// Handle  the assignments to junction tables and then
async function handleAssignments(
  trx,
  volunteerId,
  categoryIds = [],
  eventIds = []
) {
  //1. Validate inputs
  if (!volunteerId) throw new Error("Missing volunteerId");
  if (!Array.isArray(categoryIds) || !Array.isArray(eventIds)) {
    throw new Error("categoryIds and eventIds must be arrays");
  }

  //2. Validate categories exist (empty array bypasses check)
  if (categoryIds.length > 0) {
    const validCategories = await trx("categories")
      .select("id")
      .whereIn("id", categoryIds);

    if (validCategories.length !== categoryIds.length) {
      throw new Error(
        `Invalid category IDs: ${categoryIds.filter(
          (id) => !validCategories.some((c) => c.id === id)
        )}`
      );
    }

    await trx("volunteer_categories").insert(
      validCategories.map(({ id }) => ({
        volunteer_id: volunteerId,
        category_id: id,
      }))
    );
  }

  // Validate events exist
  if (eventIds.length > 0) {
    const validEvents = await trx("events")
      .select("id")
      .whereIn("id", eventIds);

    if (validEvents.length !== eventIds.length) {
      throw new Error(
        `Invalid event IDs: ${eventIds.filter(
          (id) => !validEvents.some((e) => e.id === id)
        )}`
      );
    }

    await trx("volunteer_events").insert(
      validEvents.map(({ id }) => ({
        volunteer_id: volunteerId,
        event_id: id,
      }))
    );
  }
}

//Path to get/read the volunteer tables
router.get("/", async (_req, res) => {
  try {
    //select the volunteer table
    const volunteers = await knex("volunteers").select("*");

    // Since there are junction tables, that include categories and events, need to make sure we pull the entries associated with the volunteers from these associated tables.
    const volunteerDetails = await Promise.all(
      volunteers.map(async (volunteer) => {
        const [categories, events] = await Promise.all([
          // get categories
          knex("categories")
            .select("categories.*")
            .join(
              "volunteer_categories",
              "categories.id",
              "volunteer_categories.category_id"
            ) //match to the volunteer ID
            .where("volunteer_categories.volunteer_id", volunteer.id),

          // Get associated events through volunteer_events
          knex("events")
            .select("events.*")
            .join("volunteer_events", "events.id", "volunteer_events.event_id")
            .where("volunteer_events.volunteer_id", volunteer.id),
        ]);

        return { ...volunteer, categories, events };
      })
    );
    console.log(volunteerDetails);
    res.send(volunteerDetails);
    res.json(volunteerDetails);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
});

//Get a single volunteer:
router.get("/:volunteerId", async (req, res) => {
  const { volunteerId } = req.params;

  try {
    //select the volunteer table
    const volunteer = await knex("volunteers").where("id", volunteerId).first();

    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    // Since there are junction tables, that include categories and events, need to make sure we pull the entries associated with the volunteers from these associated tables.
    const [categories, events] = await Promise.all([
      // Junction Table
      knex("categories")
        .select("categories.*")
        .join(
          "volunteer_categories",
          "categories.id",
          "volunteer_categories.category_id"
        )
        .where("volunteer_categories.volunteer_id", volunteerId),

      // Events through junction table
      knex("events")
        .select("events.*")
        .join("volunteer_events", "events.id", "volunteer_events.event_id")
        .where("volunteer_events.volunteer_id", volunteerId),
    ]);

    //create the response to be returned. Volunteer will include the entire object.
    const response = {
      ...volunteer,
      categories,
      events,
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    phoneNumber,
    email,
    categoryIds = [],
    eventIds = [],
  } = req.body;
  //validate that the neccessary field appears in the request body
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  //set up the transaction
  const trx = await knex.transaction();

  //try catch to post to the DB
  try {
    const newVolunteer = await trx("volunteers").insert({
      name,
      phoneNumber,
      email,
    });
    const volunteerId = newVolunteer;

    await handleAssignments(trx, volunteerId, categoryIds, eventIds);
    await trx.commit();
    res.status(201).json({ id: volunteerId, success: true });

    // res.sendStatus(204);
  } catch (err) {
    await trx.rollback();
    res.status(500).json({
      error: `Volunteer Creation Failed`,
      details: `Please check the fields submitted`,
    });
  }
});

//Delete the Volunteer Data
router.delete("/:id", async (req, res) => {
  try {
    //Pull id
    const { id } = req.params;

    //delete volunteer from other tables.
    await knex("volunteer_events").where("volunteer_id", id).del();
    await knex("volunteer_categories").where("volunteer_id", id).del();

    const deleteVolunteer = await knex("volunteers").where({ id }).del();
    //del returns # of deleted rows, technically truthy, but not a boolean.
    //Need to see if Delete volunteer is > 0
    //if greater than 0, it should return a positive status, otherwise state the volunteer id does not exist.
    if (deleteVolunteer > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).send(`The volunteer ${id} is not found.`);
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "internal server Error" });
  }
});

//update the volunteer
router.patch("/:volunteerId", async (req, res) => {
  const { volunteerId } = req.params;
  const { name, phoneNumber, email, categoryIds, eventIds } = req.body;

  const trx = await knex.transaction();
  try {
    //placehoilder for updates
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (email !== undefined) updates.email = email;

    if (Object.keys(updates).length > 0) {
      await trx("volunteers").where({ id: volunteerId }).update(updates);
    }

    //Replace the assignments if possible
    if (categoryIds !== undefined) {
      await trx("volunteer_categories")
        .where({ volunteer_id: volunteerId })
        .del();
      await handleAssignments(trx, volunteerId, categoryIds, []);
    }

    if (eventIds !== undefined) {
      await trx("volunteer_events").where({ volunteer_id: volunteerId }).del();
      await handleAssignments(trx, volunteerId, [], eventIds);
    }

    await trx.commit();
    res.json({ success: true });
  } catch (err) {
    await trx.rollback();
    const statusCode = err.message.includes("Invalid") ? 400 : 500;
    res.status(statusCode).json({ error: err.message });
  }
});

export default router;

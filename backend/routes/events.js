import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await knex("events").select("*");

    const eventDetails = await Promise.all(
      events.map(async (event) => {
        const [categories, volunteers] = await Promise.all([
          // get categories
          knex("categories")
            .select("categories.*")
            .join(
              "event_categories",
              "categories.id",
              "event_categories.category_id"
            )
            .where("event_categories.event_id", event.id),

          //get volunteers
          knex("volunteers")
            .select("volunteers.id", "volunteers.name", "volunteers.email")
            .join(
              "volunteer_events",
              "volunteers.id",
              "volunteer_events.volunteer_id"
            )
            .where("volunteer_events.event_id", event.id),
        ]);

        return {
          ...event,
          categories,
          volunteers,
        };
      })
    );
    console.log(eventDetails);
    res.json(eventDetails);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
});

// READ Singular Event
router.get("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const events = await knex("events").where("id", eventId).first();
  try {
    const [categories, volunteers] = await Promise.all([
      // get categories
      knex("categories")
        .select("categories.*")
        .join(
          "event_categories",
          "categories.id",
          "event_categories.category_id"
        )
        .where("event_categories.event_id", eventId), // Use eventId directly

      // get volunteers
      knex("volunteers")
        .select("volunteers.id", "volunteers.name", "volunteers.email")
        .join(
          "volunteer_events",
          "volunteers.id",
          "volunteer_events.volunteer_id"
        )
        .where("volunteer_events.event_id", eventId), // Use eventId directly
    ]);
    const eventDetails = {
      ...events,
      categories,
      volunteers,
    };

    console.log(eventDetails);
    res.json(eventDetails);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    date,
    end_date,
    description,
    location,
    image_url,
    volunteers_needed,
    categoryIds = [],
    volunteerIds = [],
  } = req.body;

  if (!name && !date) {
    return res.status(400).json({ message: "Name and date are required" });
  } else if (!name) {
    return res.status(400).json({ message: "Name is required" });
  } else if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD" });
  }

  console.log("made it past validations ");
  //set up the transaction
  let trx;

  try {
    trx = await knex.transaction();
    console.log("Request data:", {
      name,
      date,
      end_date,
      description,
      location,
      image_url,
      volunteers_needed,
    });

    const [eventId] = await trx("events").insert({
      name,
      date,
      end_date,
      description,
      location,
      image_url,
      volunteers_needed,
    });

    console.log("Made it past eventID:", eventId);

    // Check if there are categories being added..
    if (categoryIds.length > 0) {
      // Validate category IDs exist
      const validCategories = await trx("categories")
        .whereIn("id", categoryIds)
        .select("id");

      if (validCategories.length !== categoryIds.length) {
        throw new Error("Some category IDs are invalid");
      }

      await trx("event_categories").insert(
        categoryIds.map((catId) => ({
          event_id: eventId,
          category_id: catId,
        }))
      );
    }

    console.log("made it past cat valiations");

    // Check if there are volunteers being added.
    if (volunteerIds.length > 0) {
      // Validate volunteer IDs exist
      const validVolunteers = await trx("volunteers")
        .whereIn("id", volunteerIds)
        .select("id");

      if (validVolunteers.length !== volunteerIds.length) {
        throw new Error("Some volunteer IDs are invalid");
      }

      await trx("volunteer_events").insert(
        volunteerIds.map((volId) => ({
          event_id: eventId,
          volunteer_id: volId,
        }))
      );
    }
    console.log("made it past volunteer Validationa ");

    await trx.commit();
    res.status(201).json({ id: eventId, success: true });
  } catch (error) {
    if (trx) await trx.rollback();
    res.status(500).json({
      error: `Event Creation Failed`,
      details: error.message || "Please check the fields submitted", // Include actual error
    });
  }
});

//TODO: TEST THIS
router.delete("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  let trx;

  try {
    trx = await knex.transaction();
    //Delete the associated category/volunteers from the joint tables
    await trx("event_categories").where("event_id", eventId).del();
    await trx("volunteer_events").where("event_id", eventId).del();

    //delete the event from the main table...
    const deleteEvent = await trx("events").where("id", eventId).del();

    if (deleteEvent === 0) {
      await trx.rollback();
      return res.status(404).json({
        error: `Event ${eventId} not found`,
      });
    }
    await trx.commit();
    res.sendStatus(204);
  } catch (error) {
    if (trx) await trx.rollback();
    console.error(`Delete failed for event ${eventId}`, error);
    res.status(500).json({ error: "internal server Error..." });
  }
});

router.patch("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  let trx;
  const {
    name,
    date,
    end_date,
    description,
    location,
    image_url,
    volunteers_needed,
    categoryIds,
    volunteerIds,
  } = req.body;

  try {
    trx = await knex.transaction();
    //Check if the event exists
    const eventExists = await trx("events").where({ id: eventId }).first();
    if (!eventExists) {
      await trx.rollback();
      return res.status(404).json({ error: `Event ${eventId} not found` });
    }
    //placeholder for updates
    const updates = {};

    //TODO: Is there a better way to do this?
    if (name !== undefined) updates.name = name;
    if (date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        await trx.rollback();
        return res
          .status(400)
          .json({ message: "Invalid date format. Use YYYY-MM-DD" });
      }
      updates.date = date;
    }
    if (end_date !== undefined) updates.end_date = end_date;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (volunteers_needed !== undefined)
      updates.volunteers_needed = volunteers_needed;

    //Apply updates where needed..
    if (Object.keys(updates).length > 0) {
      await trx("events").where({ id: eventId }).update(updates);
    }

    //Replace the assignments within the volunteer_vents table
    if (categoryIds !== undefined) {
      // Delete The existing assignment
      await trx("event_categories").where({ event_id: eventId }).del();
      if (categoryIds.length > 0) {
        // Validate category IDs exist
        const validCategories = await trx("categories")
          .whereIn("id", categoryIds)
          .select("id");

        if (validCategories.length !== categoryIds.length) {
          throw new Error("Some category IDs are invalid");
        }

        await trx("event_categories").insert(
          categoryIds.map((catId) => ({
            event_id: eventId,
            category_id: catId,
          }))
        );
      }
    }

    // Handle volunteer assignments if provided
    if (volunteerIds !== undefined) {
      // First delete existing volunteer relationships
      await trx("volunteer_events").where({ event_id: eventId }).del();

      // Then add new ones if there are any
      if (volunteerIds.length > 0) {
        // Validate volunteer IDs exist
        const validVolunteers = await trx("volunteers")
          .whereIn("id", volunteerIds)
          .select("id");

        if (validVolunteers.length !== volunteerIds.length) {
          throw new Error("Some volunteer IDs are invalid");
        }

        await trx("volunteer_events").insert(
          volunteerIds.map((volId) => ({
            event_id: eventId,
            volunteer_id: volId,
          }))
        );
      }
    }

    await trx.commit();
    res.status(200).json({
      message: "Event updated successfully",
      id: eventId,
    });
  } catch (err) {
    console.error(`Event update failed for ID ${eventId}:`, err);
    if (trx) await trx.rollback();
    res.status(500).json({
      error: "Event update failed",
      details: err.message || "Please check the fields submitted",
    });
  }
});

export default router;

import knex from "./knexfile.js"; // Adjust path as needed

async function resetDatabase() {
  try {
    // Disable foreign key checks
    await knex.raw("SET FOREIGN_KEY_CHECKS = 0");

    // Drop tables in correct order
    await knex.schema
      .dropTableIfExists("volunteer_events")
      .dropTableIfExists("volunteer_categories")
      .dropTableIfExists("event_categories")
      .dropTableIfExists("volunteers")
      .dropTableIfExists("events")
      .dropTableIfExists("categories")
      .dropTableIfExists("knex_migrations")
      .dropTableIfExists("knex_migrations_lock");

    // Re-enable foreign key checks
    await knex.raw("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Database reset complete");
  } catch (error) {
    console.error("❌ Reset failed:", error);
  } finally {
    process.exit();
  }
}

resetDatabase();

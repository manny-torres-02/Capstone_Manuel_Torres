export async function up(knex) {
  await safeCreateTable(knex, "categories", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("description").nullable();
    table.string("icon").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await safeCreateTable(knex, "events", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.dateTime("date").notNullable();
    table.dateTime("end_date").nullable();
    table.text("description").nullable();
    table.string("location").nullable();
    table.string("image_url").nullable();
    table.integer("volunteers_needed").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await safeCreateTable(knex, "volunteers", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("phoneNumber").nullable();
    table.string("email").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 2. Create junction tables (with existence checks)
  await safeCreateTable(knex, "event_categories", (table) => {
    table
      .integer("event_id")
      .unsigned()
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
    table.primary(["event_id", "category_id"]);
  });

  await safeCreateTable(knex, "volunteer_events", (table) => {
    table
      .integer("volunteer_id")
      .unsigned()
      .references("id")
      .inTable("volunteers")
      .onDelete("CASCADE");
    table
      .integer("event_id")
      .unsigned()
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");
    table.primary(["volunteer_id", "event_id"]);
  });

  await safeCreateTable(knex, "volunteer_categories", (table) => {
    table
      .integer("volunteer_id")
      .unsigned()
      .references("id")
      .inTable("volunteers")
      .onDelete("CASCADE");
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
    table.primary(["volunteer_id", "category_id"]);
  });
}

export async function down(knex) {
  // Drop tables in reverse order (no existence checks needed)
  await knex.schema.dropTableIfExists("volunteer_categories");
  await knex.schema.dropTableIfExists("volunteer_events");
  await knex.schema.dropTableIfExists("event_categories");
  await knex.schema.dropTableIfExists("volunteers");
  await knex.schema.dropTableIfExists("events");
  await knex.schema.dropTableIfExists("categories");
}

// Helper function to safely create tables
async function safeCreateTable(knex, tableName, callback) {
  const exists = await knex.schema.hasTable(tableName);
  if (!exists) {
    await knex.schema.createTable(tableName, callback);
    console.log(`Created table: ${tableName}`);
  } else {
    console.log(`Table ${tableName} already exists - skipping`);
  }
}

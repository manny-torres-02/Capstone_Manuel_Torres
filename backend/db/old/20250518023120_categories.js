/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable("categories", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable().unique();
      table.string("description").nullable();
      table.string("icon").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .then(() =>
      knex.schema.createTable("event_categories", (table) => {
        //event-category relationship...
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
      })
    )
    .then(() =>
      knex.schema.createTable("volunteer_categories", (table) => {
        //volunteer-category relationship
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
      })
    );
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists("volunteer_categories")
    .dropTableIfExists("event_categories")
    .dropTableIfExists("categories");
}

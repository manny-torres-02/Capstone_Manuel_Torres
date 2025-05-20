/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable("volunteers", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("phoneNumber").nullable();
      table.string("email").nullable();
      table.string("category").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .then(() => {
      //Junction table for many to many relationship
      return knex.schema.createTable("volunteer_categories", (table) => {
        table.increments("id").primary();
        table
          .integer("volunteer_id")
          .unsigned()
          .references("id")
          .inTable("volunteers")
          .onDelete("CASCADE");
        table.string("category").notNullable();
        table.unique(["volunteer_id", "category"]); //Prevent duplicate volunteers
      });
    })
    .then(() => {
      // Junction table
      return knex.schema.createTable("volunteer_events", (table) => {
        table.increments("id").primary();
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
        table.unique(["volunteer_id", "event_id"]); // Prevent duplicates
      });
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists("volunteer_events")
    .then(() => knex.schema.dropTableIfExists("volunteer_categories"))
    .then(() => knex.schema.dropTableIfExists("volunteers"));
}

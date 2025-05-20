/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("events", (table) => {
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
}

export function down(knex) {
  return knex.schema.dropTable("events");
}
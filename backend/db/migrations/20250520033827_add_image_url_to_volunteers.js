export async function up(knex) {
  await knex.schema.table('volunteers', (table) => {
    table.string('image_url').nullable();
  });
}

export async function down(knex) {
  await knex.schema.table('volunteers', (table) => {
    table.dropColumn('image_url');
  });
}
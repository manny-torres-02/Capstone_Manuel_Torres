export async function seed(knex) {
  // 1. Delete existing relationships
  await knex("event_categories").del();
  await knex("volunteer_events").del();
  await knex("volunteer_categories").del();

  // 2. Get all reference IDs
  const [summerCleanup, fallCleanup, springSale, winterSetup] = await knex(
    "events"
  ).orderBy("date");
  const [maria, james, fatima, thomas, aisha] = await knex("volunteers").limit(
    5
  );
  const categories = await knex("categories").select();

  // Convert categories array to lookup object
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {});

  // 3. Seed event-category relationships
  await knex("event_categories").insert([
    // Garden cleanups
    {
      event_id: summerCleanup.id,
      category_id: categoryMap["Community Garden Maintenance"],
    },
    { event_id: fallCleanup.id, category_id: categoryMap["Weeding"] },

    // Plant sales
    { event_id: springSale.id, category_id: categoryMap["Plant Sales"] },
    { event_id: springSale.id, category_id: categoryMap["Fundraising"] },

    // Winter event
    { event_id: winterSetup.id, category_id: categoryMap["Winter Wonderland"] },
    { event_id: winterSetup.id, category_id: categoryMap["Setup/Takedown"] },
  ]);

  // 4. Seed volunteer-event relationships
  await knex("volunteer_events").insert([
    { volunteer_id: maria.id, event_id: springSale.id }, // Maria at plant sale
    { volunteer_id: fatima.id, event_id: summerCleanup.id }, // Fatima at garden cleanup
    { volunteer_id: thomas.id, event_id: winterSetup.id }, // Thomas at winter setup
    { volunteer_id: aisha.id, event_id: springSale.id }, // Aisha at plant sale
  ]);

  // 5. Seed volunteer-category relationships
  await knex("volunteer_categories").insert([
    { volunteer_id: maria.id, category_id: categoryMap["Fundraising"] },
    { volunteer_id: james.id, category_id: categoryMap["Setup/Takedown"] },
    { volunteer_id: fatima.id, category_id: categoryMap["Gardening"] },
    { volunteer_id: thomas.id, category_id: categoryMap["Winter Wonderland"] },
    { volunteer_id: aisha.id, category_id: categoryMap["Registration"] },
  ]);
}

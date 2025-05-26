export async function seed(knex) {
  await knex("categories").del();

  return knex("categories").insert([
    // Gardening & Maintenance
    {
      name: "Weeding",
      description: "Removing invasive plants and weeds",
      icon: "🌱",
    },
    {
      name: "Gardening",
      description: "Planting and general garden care",
      icon: "🌻",
    },
    {
      name: "Community Garden Maintenance",
      description: "Upkeep of shared garden spaces",
      icon: "🏡",
    },

    // Seasonal Events
    {
      name: "Winter Wonderland",
      description: "Holiday-themed volunteer activities",
      icon: "❄️",
    },
    {
      name: "Halloween",
      description: "Fall festival and haunted house setup",
      icon: "🎃",
    },

    // Fundraising & Sales
    {
      name: "Fundraising",
      description: "Organizing donation campaigns",
      icon: "💰",
    },
    {
      name: "Plant Sales",
      description: "Selling plants to support the garden",
      icon: "🪴",
    },
    {
      name: "Food Service",
      description: "Meal distribution",
      icon: "🍽️",
    },
    {
      name: "Setup/Takedown",
      description: "Event logistics",
      icon: "🛠️",
    },
    {
      name: "Registration",
      description: "Attendee check-in",
      icon: "📋",
    },
  ]);
}

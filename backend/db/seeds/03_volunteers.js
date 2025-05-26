export async function seed(knex) {
  await knex("volunteers").del();

  return knex("volunteers").insert([
    {
      name: "Maria Garcia",
      phoneNumber: "4145550123",
      email: "maria.garcia@example.com",
      image_url: "https://example.com/volunteers/maria.jpg",
    },
    {
      name: "James Wilson",
      phoneNumber: "4145550456",
      email: "james.wilson@example.com",
      image_url: "https://example.com/volunteers/james.jpg",
    },
    {
      name: "Fatima Nguyen",
      phoneNumber: "4145550789",
      email: "fatima.nguyen@example.com",
      image_url: "https://example.com/volunteers/fatima.jpg",
    },
    {
      name: "Thomas Kowalski",
      phoneNumber: "4145550912",
      email: "t.kowalski@example.com",
      image_url: "https://example.com/volunteers/thomas.jpg",
    },
    {
      name: "Aisha Johnson",
      phoneNumber: "4145550345",
      email: "aisha.j@example.com",
      image_url: "https://example.com/volunteers/aisha.jpg",
    },
    {
      name: "Carlos Martinez",
      phoneNumber: "4145550678",
      email: "carlos.m@example.com",
      image_url: "https://example.com/volunteers/carlos.jpg",
    },
    {
      name: "Ethan Miller",
      phoneNumber: "4145550890",
      email: "ethan.miller@example.com",
      image_url: "https://example.com/volunteers/ethan.jpg",
    },
    {
      name: "Yuki Tanaka",
      phoneNumber: "4145550321",
      email: "yuki.t@example.com",
      image_url: "https://example.com/volunteers/yuki.jpg",
    },
  ]);
}

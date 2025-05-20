export async function seed(knex) {
  await knex('events').del();

  return knex('events').insert([
    // Summer Garden Events
    {
      name: 'Community Garden Cleanup - July',
      date: new Date('2024-07-13 09:00'),
      end_date: new Date('2024-07-13 14:00'),
      location: 'Humboldt Park, Milwaukee WI',
      description: 'Help us prepare the garden for peak summer growth! Tasks include weeding, mulching, and pathway maintenance.',
      volunteers_needed: 15,
      image_url: 'https://example.com/images/garden-cleanup.jpg'
    },
    {
      name: 'Community Garden Cleanup - August',
      date: new Date('2024-08-10 09:00'),
      end_date: new Date('2024-08-10 14:00'),
      location: 'Howard and 6th, Milwaukee WI',
      description: 'Pre-fall cleanup to remove spent plants and prepare garden beds.',
      volunteers_needed: 12,
      image_url: 'https://example.com/images/garden-cleanup2.jpg'
    },

    // Plant Sales
    {
      name: 'Annual Spring Plant Sale',
      date: new Date('2024-06-08 10:00'),
      end_date: new Date('2024-06-08 16:00'),
      location: 'Wilson Park, Milwaukee WI',
      description: 'Seedlings and mature plants grown by our volunteers. Proceeds support community garden programs.',
      volunteers_needed: 20,
      image_url: 'https://example.com/images/plant-sale.jpg'
    },
    {
      name: 'Fall Harvest Plant Sale',
      date: new Date('2024-09-14 10:00'),
      end_date: new Date('2024-09-14 16:00'),
      location: 'Humboldt Park, Milwaukee WI',
      description: 'Perennials, bulbs, and garden tools for your autumn planting needs.',
      volunteers_needed: 18,
      image_url: 'https://example.com/images/fall-plant-sale.jpg'
    },

    // Winter Event
    {
      name: 'Winter Wonderland Setup',
      date: new Date('2024-11-23 08:00'),
      end_date: new Date('2024-11-24 18:00'),
      location: 'Howard and 6th, Milwaukee WI',
      description: 'Transform the garden into a holiday wonderland! Includes light installation, decoration, and Santa\'s workshop setup.',
      volunteers_needed: 25,
      image_url: 'https://example.com/images/winter-setup.jpg'
    },

    {
      name: 'Summer Festival',
      date: new Date('2024-07-20 18:00'),
      end_date: new Date('2024-07-21 22:00'),
      location: 'Humboldt Park, Milwaukee WI',
      volunteers_needed: 30
    }
  ]);
}
# Backend - API Server

This is the backend server for the project, built with Node.js and Express. It handles API requests, business logic, and future database interactions.

## Routes

#### Volunteer tables

- [x] Read all volunteers
- [x] read a single Volunteer
- [x] pull in the associated categories and events for reading the tables
- [x] Post new Volunteeer to the volunteer table, add that volunteer automatically to the associated Categories and evetns joint tables
- [x] delete a volunteer and its association to other tables.

####

## How to Use

1. Navigate to the backend folder:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file
4. Run a local development server:
   ```
   npm run dev
   ```

## Database

- Run latest migration
  ```
  npm run migrate:latest
  ```
- Run the `migrate:down` command
  ```
  npm run migrate:down
  ```
- Run the `rollback` command
  ```
  npm run migrate:rollback
  ```
- Run the `seed` command
  ```
  npm run seed
  ```

## Env file

Create the Env file, and then fill in the below information
PORT=8080
DB_HOST=127.0.0.1
DB_NAME=<YOUR_DB_NAME>
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>

## common Commands used:

-intiliatize new package.json

```
npm init or npm init -y
```

-install Knex and mysql

```
npm install knex mysql2 dotenv
```

- npx knex init

  ```
  npx knex init
  ```

- Create a migration file

```
npx knex migrate:make <migration_file_name>
```

- create the latest table file

```
npx knex migrate:latest
```

- rollback the tables

```npx knex migrate:rollback or npx knex migrate:down

```

- make seed file

```
npx knex seed:make <seed_file_name>
```

- migrate the seed file

```
npx knex seed:run
```

- example mysql commands

```
-- Check volunteers
SELECT * FROM volunteers LIMIT 5;

-- Check events with their categories
SELECT e.name AS event, GROUP_CONCAT(c.name) AS categories
FROM events e
LEFT JOIN event_categories ec ON e.id = ec.event_id
LEFT JOIN categories c ON ec.category_id = c.id
GROUP BY e.id;

-- Check volunteer assignments
SELECT v.name AS volunteer, e.name AS event
FROM volunteers v
JOIN volunteer_events ve ON v.id = ve.volunteer_id
JOIN events e ON ve.event_id = e.id;
```

kill node instances - if the local host/server is not being updated, then run this and rerun npm run dev
killall node

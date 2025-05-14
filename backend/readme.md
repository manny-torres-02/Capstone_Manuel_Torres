# Backend - API Server

This is the backend server for the project, built with Node.js and Express. It handles API requests, business logic, and future database interactions.

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

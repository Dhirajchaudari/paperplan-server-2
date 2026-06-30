# Paperplane Backend API

Step 2 of the Full Stack Developer Technical Assignment for Paper Plane. This is a Node.js + Express backend service built with strict TypeScript and SQLite to support a Task Dashboard.

## Key Features

- **Strict TypeScript**: Full type-safety with `noImplicitAny` and strict validation rules.
- **Session Auth (Cookies)**: Custom JWT session token delivered via `httpOnly`, `secure` (in production), and `sameSite=strict` cookies.
- **Embedded Database**: Fast storage using `better-sqlite3`, automatically initialized with database tables and triggers on startup.
- **Request Validation**: Clean, schema-based request validation ensuring valid inputs on task operations.
- **Centralized Error Handling**: Express middleware that catches all errors and returns them in a consistent JSON format `{ error: string, statusCode: number }`.
- **Comprehensive Integration Tests**: Jest and Supertest suites validating user workflows and security checks.

## Folder Structure

```text
server/
├── src/
│   ├── config/
│   │   └── env.ts            # Validates and exports typed environment variables
│   ├── db/
│   │   ├── connection.ts     # Configures and exports the better-sqlite3 database connection
│   │   └── schema.ts         # Automatically runs table schemas on startup
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Verifies JWT from cookie, attaches req.user, else 401
│   │   ├── error.middleware.ts    # Centralized JSON error handler
│   │   └── validate.middleware.ts # Request body validation helper
│   ├── modules/
│   │   ├── auth/             # Handles register, login, and logout operations
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── interfaces/
│   │   │   └── test/
│   │   └── tasks/            # Handles task CRUD and query filtering
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── routes/
│   │       ├── interfaces/
│   │       └── test/
│   ├── app.ts                # Express application configurations and global middleware
│   └── server.ts             # Server entry point
├── .env.example
├── .env                      # Local developer configuration (git-ignored)
├── tsconfig.json
├── jest.config.ts
└── package.json
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root of the `server/` directory (template provided in `.env.example`):
   ```env
   PORT=4000
   JWT_SECRET=dev-secret-change-me
   NODE_ENV=development
   FRONTEND_ORIGIN=http://localhost:5173
   DB_PATH=./data.sqlite
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *Note: On startup, the SQLite database file will automatically be created and schema migration tables will execute.*

4. **Run Integration Tests**:
   ```bash
   npm test
   ```
   *Note: Integration tests use a separate, temporary in-memory database to prevent test pollution of local data.*

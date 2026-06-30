const dotenv = require('dotenv');
dotenv.config();

process.env.DB_PATH = ':memory:';
process.env.PORT = '9999';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';

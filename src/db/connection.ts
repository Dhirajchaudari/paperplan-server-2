import Database from 'better-sqlite3';
import { env } from '../config/env';
import { initSchema } from './schema';

const db = new Database(env.DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

initSchema(db);

export default db;

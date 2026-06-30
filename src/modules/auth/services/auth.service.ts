import db from '../../../db/connection';
import bcrypt from 'bcrypt';
import { User, UserResponseDto } from '../interfaces/auth.interfaces';
import { AppError } from '../../../middleware/error.middleware';

export class AuthService {
  public async register(username: string, password: string): Promise<UserResponseDto> {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      throw new AppError('Username is already taken', 400);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
      const stmt = db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)');
      const info = stmt.run(username, passwordHash);
      const userId = info.lastInsertRowid as number;

      const user = db
        .prepare('SELECT id, username, createdAt FROM users WHERE id = ?')
        .get(userId) as UserResponseDto;

      return user;
    } catch (err: any) {
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        throw new AppError('Username is already taken', 400);
      }
      throw err;
    }
  }

  public async login(username: string, password: string): Promise<UserResponseDto> {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
    
    if (!user) {
      throw new AppError('Invalid username or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid username or password', 401);
    }

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}

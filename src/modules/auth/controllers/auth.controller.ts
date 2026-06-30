import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { env } from '../../../config/env';
import { AppError } from '../../../middleware/error.middleware';

const authService = new AuthService();

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new AppError('Username and password are required', 400);
      }

      if (typeof username !== 'string' || typeof password !== 'string') {
        throw new AppError('Username and password must be strings', 400);
      }

      const user = await authService.register(username, password);

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        env.JWT_PRIVATE_KEY,
        { algorithm: 'RS256', expiresIn: '1d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new AppError('Username and password are required', 400);
      }

      const user = await authService.login(username, password);

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        env.JWT_PRIVATE_KEY,
        { algorithm: 'RS256', expiresIn: '1d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  public async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
}

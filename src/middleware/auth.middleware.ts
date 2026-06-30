import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error.middleware';

export interface UserPayload {
  userId: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] }) as any;
    
    if (!decoded || typeof decoded.userId !== 'number' || typeof decoded.username !== 'string') {
      return next(new AppError('Unauthorized: Invalid token payload', 401));
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    
    next();
  } catch (err) {
    return next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
}

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_for_propchain';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).user = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Soft version — attaches user if token present but never rejects
export const optionalProtect = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).user = await User.findById(decoded.id).select('-password');
    } catch { /* ignore — user stays undefined */ }
  }
  next();
};

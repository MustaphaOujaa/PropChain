import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_for_propchain';

const generateToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

const formatUser = (user: any) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatarUrl,
  walletBalance: user.walletBalance,
  nftCollection: user.nftCollection,
});

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      email,
      password,
      name: name || 'PropChain User',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    });
    res.status(201).json({ ...formatUser(user), token: generateToken((user._id as any).toString()) });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await (user as any).matchPassword(password))) {
      res.json({ ...formatUser(user), token: generateToken((user._id as any).toString()) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).populate('nftCollection');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

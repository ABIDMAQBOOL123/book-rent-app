import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';


export const createUser = [
  
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Invalid email format')
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body('phone').notEmpty().withMessage('Phone number is required'),


  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; 
    }

    const { name, email, phone } = req.body;
    try {
      const newUser = new User({ name, email, phone });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error while creating user', error: (error as Error).message });
    }
  },
];


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving users', error: (error as Error).message });
  }
};

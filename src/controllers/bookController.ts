import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Book from '../models/Book';


export const createBook = [

  body('name').notEmpty().withMessage('Book name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('rentPerDay').isNumeric().withMessage('Rent per day must be a number'),

  
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }

    const { name, category, rentPerDay } = req.body;
    try {
      const newBook = new Book({ name, category, rentPerDay });
      await newBook.save();
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ message: 'Server error while creating book', error: (error as Error).message });
    }
  },
];


export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving books', error: (error as Error).message });
  }
};


export const searchBooks = [
  query('name').notEmpty().withMessage('Book name or term is required'),

  
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.query;
    try {
      const books = await Book.find({ name: { $regex: name, $options: 'i' } });
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Server error while searching books', error: (error as Error).message });
    }
  },
];


export const getBooksByRent = [
  query('min').isNumeric().withMessage('Minimum rent must be a number'),
  query('max').isNumeric().withMessage('Maximum rent must be a number'),

  
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
    }

    const { min, max } = req.query;
    try {
      const books = await Book.find({ rentPerDay: { $gte: min, $lte: max } });
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Server error while retrieving books by rent', error: (error as Error).message });
    }
  },
];


export const filterBooks = [
  query('category').notEmpty().withMessage('Category is required'),
  query('minRent').isNumeric().withMessage('Minimum rent must be a number'),
  query('maxRent').isNumeric().withMessage('Maximum rent must be a number'),
  query('name').optional().notEmpty().withMessage('Book name or term is required'),

  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
    }

    const { category, name, minRent, maxRent } = req.query;
    try {
      const books = await Book.find({
        category,
        name: name ? { $regex: name, $options: 'i' } : undefined,
        rentPerDay: { $gte: minRent, $lte: maxRent },
      });
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Server error while filtering books', error: (error as Error).message });
    }
  },
];

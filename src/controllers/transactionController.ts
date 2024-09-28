import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Transaction from '../models/Transaction';
import Book from '../models/Book';
import User from '../models/User';


export const issueBook = [
  
  body('bookName').notEmpty().withMessage('Book name is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required'),

  
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { bookName, userId, issueDate } = req.body;
      try {
        const book = await Book.findOne({ name: bookName });
        if (!book) {
          res.status(404).json({ message: 'Book not found' });
        } else {
          const newTransaction = new Transaction({ bookId: book._id, userId, issueDate });
          await newTransaction.save();
          res.status(201).json(newTransaction);
        }
      } catch (error) {
        res.status(500).json({ message: 'Server error while issuing book', error: (error as Error).message });
      }
    }
  },
];


export const returnBook = [
  
  body('bookName').notEmpty().withMessage('Book name is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('returnDate').isISO8601().withMessage('Valid return date is required'),

  
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { bookName, userId, returnDate } = req.body;
      try {
        const book = await Book.findOne({ name: bookName });
        if (!book) {
          res.status(404).json({ message: 'Book not found' });
        } else {
          const transaction = await Transaction.findOne({ bookId: book._id, userId, returnDate: null });
          if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
          } else {
            const totalRent = calculateRent(transaction.issueDate, returnDate, book.rentPerDay);
            transaction.returnDate = returnDate;
            transaction.totalRent = totalRent; 
            await transaction.save();
            res.status(200).json(transaction);
          }
        }
      } catch (error) {
        res.status(500).json({ message: 'Server error while returning book', error: (error as Error).message });
      }
    }
  },
];


const calculateRent = (issueDate: Date, returnDate: string, rentPerDay: number): number => {
  const returnD = new Date(returnDate);
  const timeDifference = returnD.getTime() - issueDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return daysDifference * rentPerDay;
};


export const getIssuedHistory = [
  
  query('bookName').notEmpty().withMessage('Book name is required'),

  
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { bookName } = req.query;
      try {
        const book = await Book.findOne({ name: bookName });
        if (!book) {
          res.status(404).json({ message: 'Book not found' });
        } else {
          const transactions = await Transaction.find({ bookId: book._id }).populate('userId');
          const currentTransaction = transactions.find(t => !t.returnDate);

          const totalIssued = transactions.length;

          res.status(200).json({
            totalIssued,
            currentHolder: currentTransaction ? currentTransaction.userId : null,
          });
        }
      } catch (error) {
        console.error('Error fetching issued history:', error);
        res.status(500).json({ message: 'Server error while fetching issued history', error: (error as Error).message });
      }
    }
  },
];

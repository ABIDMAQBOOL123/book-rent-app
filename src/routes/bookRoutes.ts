import express from 'express';
import {
  createBook,
  getBooks,
  searchBooks,
  getBooksByRent,
  filterBooks
} from '../controllers/bookController';

const router = express.Router();

router.post('/books', createBook);
router.get('/books', getBooks);
router.get('/books/search', searchBooks);
router.get('/books/rent', getBooksByRent);
router.get('/books/filter', filterBooks);

export default router;

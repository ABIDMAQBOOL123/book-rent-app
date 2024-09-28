import express from 'express';
import {
  issueBook,
  returnBook,
  getIssuedHistory
} from '../controllers/transactionController';

const router = express.Router();

router.post('/transactions/issue', issueBook);
router.post('/transactions/return', returnBook);
router.get('/transactions/history', getIssuedHistory);

export default router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssuedHistory = exports.returnBook = exports.issueBook = void 0;
const express_validator_1 = require("express-validator");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Book_1 = __importDefault(require("../models/Book"));
exports.issueBook = [
    (0, express_validator_1.body)('bookName').notEmpty().withMessage('Book name is required'),
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('issueDate').isISO8601().withMessage('Valid issue date is required'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            const { bookName, userId, issueDate } = req.body;
            try {
                const book = yield Book_1.default.findOne({ name: bookName });
                if (!book) {
                    res.status(404).json({ message: 'Book not found' });
                }
                else {
                    const newTransaction = new Transaction_1.default({ bookId: book._id, userId, issueDate });
                    yield newTransaction.save();
                    res.status(201).json(newTransaction);
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Server error while issuing book', error: error.message });
            }
        }
    }),
];
exports.returnBook = [
    (0, express_validator_1.body)('bookName').notEmpty().withMessage('Book name is required'),
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('returnDate').isISO8601().withMessage('Valid return date is required'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            const { bookName, userId, returnDate } = req.body;
            try {
                const book = yield Book_1.default.findOne({ name: bookName });
                if (!book) {
                    res.status(404).json({ message: 'Book not found' });
                }
                else {
                    const transaction = yield Transaction_1.default.findOne({ bookId: book._id, userId, returnDate: null });
                    if (!transaction) {
                        res.status(404).json({ message: 'Transaction not found' });
                    }
                    else {
                        const totalRent = calculateRent(transaction.issueDate, returnDate, book.rentPerDay);
                        transaction.returnDate = returnDate;
                        transaction.totalRent = totalRent; // Ensure this property exists in the model
                        yield transaction.save();
                        res.status(200).json(transaction);
                    }
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Server error while returning book', error: error.message });
            }
        }
    }),
];
const calculateRent = (issueDate, returnDate, rentPerDay) => {
    const returnD = new Date(returnDate);
    const timeDifference = returnD.getTime() - issueDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference * rentPerDay;
};
exports.getIssuedHistory = [
    (0, express_validator_1.query)('bookName').notEmpty().withMessage('Book name is required'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            const { bookName } = req.query;
            try {
                const book = yield Book_1.default.findOne({ name: bookName });
                if (!book) {
                    res.status(404).json({ message: 'Book not found' });
                }
                else {
                    const transactions = yield Transaction_1.default.find({ bookId: book._id }).populate('userId');
                    const currentTransaction = transactions.find(t => !t.returnDate);
                    const totalIssued = transactions.length;
                    res.status(200).json({
                        totalIssued,
                        currentHolder: currentTransaction ? currentTransaction.userId : null,
                    });
                }
            }
            catch (error) {
                console.error('Error fetching issued history:', error);
                res.status(500).json({ message: 'Server error while fetching issued history', error: error.message });
            }
        }
    }),
];

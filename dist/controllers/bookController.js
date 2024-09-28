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
exports.filterBooks = exports.getBooksByRent = exports.searchBooks = exports.getBooks = exports.createBook = void 0;
const express_validator_1 = require("express-validator");
const Book_1 = __importDefault(require("../models/Book"));
// Create book with validation and error handling
exports.createBook = [
    // Validation rules
    (0, express_validator_1.body)('name').notEmpty().withMessage('Book name is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('rentPerDay').isNumeric().withMessage('Rent per day must be a number'),
    // Handler
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const { name, category, rentPerDay } = req.body;
        try {
            const newBook = new Book_1.default({ name, category, rentPerDay });
            yield newBook.save();
            res.status(201).json(newBook);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error while creating book', error: error.message });
        }
    }),
];
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.default.find();
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error while retrieving books', error: error.message });
    }
});
exports.getBooks = getBooks;
exports.searchBooks = [
    (0, express_validator_1.query)('name').notEmpty().withMessage('Book name or term is required'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const { name } = req.query;
        try {
            const books = yield Book_1.default.find({ name: { $regex: name, $options: 'i' } });
            res.status(200).json(books);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error while searching books', error: error.message });
        }
    }),
];
exports.getBooksByRent = [
    (0, express_validator_1.query)('min').isNumeric().withMessage('Minimum rent must be a number'),
    (0, express_validator_1.query)('max').isNumeric().withMessage('Maximum rent must be a number'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const { min, max } = req.query;
        try {
            const books = yield Book_1.default.find({ rentPerDay: { $gte: min, $lte: max } });
            res.status(200).json(books);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error while retrieving books by rent', error: error.message });
        }
    }),
];
exports.filterBooks = [
    (0, express_validator_1.query)('category').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.query)('minRent').isNumeric().withMessage('Minimum rent must be a number'),
    (0, express_validator_1.query)('maxRent').isNumeric().withMessage('Maximum rent must be a number'),
    (0, express_validator_1.query)('name').optional().notEmpty().withMessage('Book name or term is required'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const { category, name, minRent, maxRent } = req.query;
        try {
            const books = yield Book_1.default.find({
                category,
                name: name ? { $regex: name, $options: 'i' } : undefined,
                rentPerDay: { $gte: minRent, $lte: maxRent },
            });
            res.status(200).json(books);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error while filtering books', error: error.message });
        }
    }),
];

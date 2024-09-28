"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const router = express_1.default.Router();
router.post('/books', bookController_1.createBook);
router.get('/books', bookController_1.getBooks);
router.get('/books/search', bookController_1.searchBooks);
router.get('/books/rent', bookController_1.getBooksByRent);
router.get('/books/filter', bookController_1.filterBooks);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    bookId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Book' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    totalRent: { type: Number, default: 0 },
});
const Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.default = Transaction;

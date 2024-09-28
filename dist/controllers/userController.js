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
exports.getUsers = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
exports.createUser = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Invalid email format')
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        return true;
    })),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, email, phone } = req.body;
        try {
            const newUser = new User_1.default({ name, email, phone });
            yield newUser.save();
            res.status(201).json(newUser);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error while creating user', error: error.message });
        }
    }),
];
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error while retrieving users', error: error.message });
    }
});
exports.getUsers = getUsers;

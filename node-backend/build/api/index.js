"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = __importDefault(require("../config"));
const database_1 = __importDefault(require("../loaders/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const utils_1 = __importStar(require("../utils"));
exports.default = () => {
    const app = (0, express_1.Router)();
    //TODO: add routes here...
    app.post("/orders", (0, utils_1.authenticateToken)(), async (req, res) => {
        try {
            const user = res.locals.user;
            const receiver = req.body.receiver;
            const instance = new razorpay_1.default({
                key_id: config_1.default.razorpay.key_id,
                key_secret: config_1.default.razorpay.key_secret,
            });
            const options = {
                amount: req.body.amount,
                currency: "INR",
                receipt: (0, uuid_1.v4)(),
            };
            const order = await instance.orders.create(options);
            if (!order)
                return res.status(500).send("Some error occured");
            const collection = (await (0, database_1.default)()).collection('orders');
            await collection.insertOne({
                orderId: order.id,
                userId: user.userId,
                amount: order.amount / 100,
                currency: order.currency,
                receipt: order.receipt,
                status: order.status,
                receiver: receiver,
            });
            const updateUser = await (await (0, database_1.default)()).collection('users').findOne({ userId: user.userId });
            const newExpense = order.amount / 100;
            const income = updateUser.income;
            const balance = income - newExpense;
            await (await (0, database_1.default)()).collection('users').updateOne({ userId: user.userId }, {
                $set: {
                    balance: income - newExpense, expense: updateUser.expense + newExpense
                }
            });
            res.json(order);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    app.post("/signup", async (req, res) => {
        try {
            const collection = (await (0, database_1.default)()).collection('users');
            const user = await collection.findOne({ email: req.body.email });
            if (user) {
                throw new Error('User already exist with same email');
            }
            const saltRounds = 10;
            const hash = await bcrypt_1.default.hash(req.body.password, saltRounds);
            await collection.insertOne({
                userId: (0, uuid_1.v4)(),
                name: req.body.name,
                email: req.body.email,
                password: hash,
                income: 0,
                expense: 0,
                balance: 0,
            });
            res.status(201).send({
                success: true,
                message: 'User created successfully',
            });
        }
        catch (error) {
            if (error.message === 'User already exist with same email') {
                res.status(409).send({
                    success: false,
                    message: error.message,
                });
                return;
            }
            res.status(500).send({
                success: false,
                message: error.message,
            });
        }
    });
    app.post("/login", async (req, res) => {
        try {
            const data = await (await (0, database_1.default)()).collection('users').findOne({ email: req.body.email });
            if (!data) {
                throw { statusCode: 404, message: 'User Does Not Exsist' };
            }
            const result = await bcrypt_1.default.compare(req.body.password, data.password);
            if (!result) {
                throw { statusCode: 401, message: 'Incorrect Password / Not Allowed' };
            }
            const user = await (await (0, database_1.default)()).collection('users').findOne({ email: req.body.email }, {
                projection: { password: 0, _id: 0 }
            });
            res.status(200).json({
                success: true,
                message: 'login Successful',
                user,
                jwt: (0, utils_1.default)(data.email),
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).send({
                success: false,
                message: error.message,
            });
        }
    });
    app.get("/orders", (0, utils_1.authenticateToken)(), async (req, res) => {
        try {
            const user = res.locals.user;
            const collection = (await (0, database_1.default)()).collection('orders');
            const orders = await collection.find({ userId: user.userId }).toArray();
            res.json(orders);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    app.get("/orders/:orderId", (0, utils_1.authenticateToken)(), async (req, res) => {
        try {
            const user = res.locals.user;
            const collection = (await (0, database_1.default)()).collection('orders');
            const order = await collection.findOne({ orderId: req.params.orderId, userId: user.userId });
            res.json(order);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    app.get("/user", (0, utils_1.authenticateToken)(), async (req, res) => {
        try {
            const user = res.locals.user;
            res.json(user);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    app.post("/income", (0, utils_1.authenticateToken)(), async (req, res) => {
        try {
            const email = res.locals.user.email;
            const collection = (await (0, database_1.default)()).collection('users');
            const user = await collection.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            await collection.updateOne({ email }, { $set: { income: req.body.income, balance: req.body.income, expense: 0 } });
            res.json({ success: true, message: 'Income updated successfully' });
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    return app;
};
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = __importDefault(require("../config"));
exports.default = () => {
    const app = (0, express_1.Router)();
    //TODO: add routes here...
    app.post("/orders", async (req, res) => {
        try {
            const instance = new razorpay_1.default({
                key_id: config_1.default.razorpay.key_id,
                key_secret: config_1.default.razorpay.key_secret,
            });
            const options = {
                amount: req.body.amount,
                currency: "INR",
                receipt: "receipt_order_74394",
            };
            const order = await instance.orders.create(options);
            if (!order)
                return res.status(500).send("Some error occured");
            res.json(order);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    return app;
};
//# sourceMappingURL=index.js.map
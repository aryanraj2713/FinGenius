"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
exports.default = {
    /**
     * Port the app should run on
     */
    port: parseInt(process.env.PORT) || 5050,
    /**
     * Database the app should connect to
     */
    databaseURL: process.env.MONGODB_URI,
    /**
     * The secret sauce to validate JWT
     */
    jwtSecret: process.env.JWT_SECRET,
    /**
     * Used by Winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
    /**
     * Razorpay configs
     */
    razorpay: {
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    },
};
//# sourceMappingURL=index.js.map
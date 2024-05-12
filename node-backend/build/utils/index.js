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
exports.verifyToken = exports.authenticateToken = void 0;
const JWT = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const database_1 = __importDefault(require("../loaders/database"));
const authenticateToken = () => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
            if (!token) {
                throw { statusCode: 401, message: 'Token Not Found' };
            }
            const { email } = verifyToken(token);
            const data = await (await (0, database_1.default)()).collection('users').findOne({ email });
            if (!data) {
                throw { statusCode: 404, message: 'User Not Found' };
            }
            // req.headers.authorization = data;
            res.locals.user = data;
            next();
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message,
            });
        }
    };
};
exports.authenticateToken = authenticateToken;
function generateToken(email) {
    return JWT.sign({ email }, config_1.default.jwtSecret, { expiresIn: '1d', algorithm: 'HS256' });
}
exports.default = generateToken;
function verifyToken(token) {
    const data = JWT.verify(token, config_1.default.jwtSecret);
    return data;
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=index.js.map
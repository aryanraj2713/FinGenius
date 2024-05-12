import * as JWT from 'jsonwebtoken';
import config from '../config';
import { NextFunction, Request, Response } from 'express';
import database from '../loaders/database';

export const authenticateToken = (): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) {
                throw { statusCode: 401, message: 'Token Not Found' };
            }
            const { email } = verifyToken(token);
            const data = await (await database()).collection('users').findOne({ email });
            if (!data) {
                throw { statusCode: 404, message: 'User Not Found' };
            }
            // req.headers.authorization = data;
            res.locals.user = data;
            next();
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message,
            });
        }
    };
}

export default function generateToken(email: string): string {
    return JWT.sign({ email }, config.jwtSecret, { expiresIn: '1d', algorithm: 'HS256' } as JWT.SignOptions);
}

export function verifyToken(token: string): { email: string } {
    const data = JWT.verify(token, config.jwtSecret) as string;

    return data as unknown as { email: string };
}
import jwt from 'jsonwebtoken';
import userModel from '../db/models/user.model.js';

export const Authenticate = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, 'msa123');

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};

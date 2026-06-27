import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE');

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response): Promise<any> => {
    try {
        const { credential, accessToken } = req.body;
        if (!credential && !accessToken) {
            return res.status(400).json({ error: 'Credential or accessToken is required' });
        }

        let payload: { email?: string; name?: string; sub?: string } | null = null;

        if (credential) {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
            });
            payload = ticket.getPayload() || null;
        } else if (accessToken) {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                payload = { email: data.email, name: data.name, sub: data.sub };
            }
        }
        
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token' });
        }

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                name: payload.name || payload.email.split('@')[0],
                email: payload.email,
                googleId: payload.sub,
            });
        } else if (!user.googleId) {
            user.googleId = payload.sub;
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Google auth error:', err);
        res.status(500).json({ error: 'Server error during Google auth' });
    }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const user = await User.create({ name, email, password });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
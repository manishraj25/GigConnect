import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

//Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'name, email, password and role are required' });
        }

        if (!['client', 'freelancer'].includes(role)) {
            return res.status(400).json({ message: 'role must be client or freelancer' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role
        });


        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ success: true, message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error('registerUser error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.json({ success: true, message: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('authUser error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


//logout
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
        });

        return res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}



export { registerUser, loginUser, logoutUser};


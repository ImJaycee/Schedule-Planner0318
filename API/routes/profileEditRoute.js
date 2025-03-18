import express from 'express';

import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user details
router.put('/:id', async (req, res) => {
    const { firstname, lastname, email, department } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;
        user.department = department || user.department;

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user password
router.put('/:id/password', async (req, res) => {
    const { password, confirmPassword } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
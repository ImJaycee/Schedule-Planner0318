import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const GetSpecificUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const UpdateUserDetails = async (req, res) => {
    const { firstname, lastname, email, department, image } = req.body; // Destructure image from req.body
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;
        user.department = department || user.department;
        user.image = image || user.image; // Assign image correctly

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const UpdateUserPassword = async (req, res) => {
    console.log('UpdateUserPassword function called');
    const { password, confirmPassword } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User before update:', user);

        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                console.log('Passwords do not match');
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        } else {
            console.log('Password and Confirm Password are required');
            return res.status(400).json({ message: 'Password and Confirm Password are required' });
        }

        await user.save();
        console.log('User after update:', user);
        console.log('Password updated successfully');
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: error.message });
    }
};
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';

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
    const { firstname, lastname, email, department } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upload image to Cloudinary if a new one is provided
        let imageUrl = user.image; // Default to existing image
        if (req.file) {
            try {
                imageUrl = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "user_profiles", transformation: [{ width: 300, height: 300, crop: "fill" }] },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    );
                    uploadStream.end(req.file.buffer); // Use the file buffer from multer
                });
            } catch (error) {
                return res.status(500).json({ message: "Image upload to Cloudinary failed", error: error.message });
            }
        }

        // Update user details
        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;
        user.department = department || user.department;
        user.image = imageUrl; // Save Cloudinary image URL

        await user.save();
        res.json({ message: "User updated successfully", imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const UpdateUserPassword = async (req, res) => {
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
};
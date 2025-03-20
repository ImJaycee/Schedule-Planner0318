import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { createError } from '../utils/error.js';

dotenv.config()

export const VerifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query; // Extract token from the URL

        if (!token) return res.status(400).send("Invalid or missing token.");

        // Find the user where the token is still valid
        const user = await User.findOne({
            verificationExpires: { $gt: Date.now() }
        });

        if (!user){
             return res.status(400).send(`
                <script>
                    alert("Verification token expired or Invalid");
                     window.location.href = "http://localhost:5173/login";
                </script>
            `);
        }

        // Compare the stored hashed token with the received token
        const isMatch = bcrypt.compareSync(token, user.verificationToken);
        if (!isMatch) return res.status(400).send("Invalid verification token.");

        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationExpires = null;
        await user.save();

        res.status(200).send(`
    <script>
        alert("Email verified successfully. You can now log in.");
        window.location.href = "http://localhost:5173/login"; // Redirect to the login page
    </script>
`);
    } catch (error) {
        next(error);
    }
};

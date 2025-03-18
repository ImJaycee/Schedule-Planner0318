import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Create a new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, department, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      department,
      password: hashedPassword,
      isAdmin,
      isVerified: true, // Automatically set isVerified to true
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate user (Admin only)
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeactivated: true }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deactivated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate user (Admin only)
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeactivated: false }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User activated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
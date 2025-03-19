import express from 'express';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

 // update a User
export const updateUser = async(req, res, next) => {
     const id = req.params.id; // Extract ID from URL
            const updateData = req.body; 
    
           try {
            const update_User = await User.findByIdAndUpdate(id, updateData, {
                new: true, // Return updated document
                runValidators: true, // Ensure model validation
            });
    
            if (!update_User) {
                return res.status(404).json({ message: "User not found" });
            }

            const userDetails = update_User.toObject ? update_User.toObject() : update_User;

            const { password, isAdmin, ...otherDetails } = userDetails; 
    
            res.status(200).json(otherDetails);
           } catch (error) {
                next(error);
           }
};

// delete User
export const deleteUser = async(req, res, next) => { 
      try {
            const delete_User = await User.findByIdAndDelete(req.params.id);
    
            if (!delete_User) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({message: "User deleted successfully"});
            
        } catch (error) {
            next(error);
        }
};

// get User
export const getUser = async(req, res, next) => { 
    try {
            const get_User = await User.findById(req.params.id);
    
            if (!get_User) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(get_User);
            
        } catch (error) {
            next(error);
        }
};

// get all User
export const getAllUser = async(req, res, next) => { 
    try {
            const getAll_User = await User.find();
    
            if (getAll_User.length === 0) {
                return res.status(404).json({ message: "Empty" });
            }
            
            return res.send(getAll_User);
            
        } catch (error) {
            next(error);
        }
};


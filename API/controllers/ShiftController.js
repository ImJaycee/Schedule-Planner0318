import express from 'express';
import User from '../models/User.js';
import Shift from '../models/Schedule.js';
import { createError } from '../utils/error.js';




export const CreateShift = async (req, res, next) => {
    try {
        const { date, startTime, endTime, shiftType, assignedEmployees } = req.body;

        // Convert date to ensure consistency
        const shiftDate = new Date(date).toISOString().split("T")[0];

        // Check if a shift with the same date, start & end time, and shift type exists
        let existingShift = await Shift.findOne({ date: shiftDate, startTime, endTime, shiftType });

        if (existingShift) {
            // Use MongoDB `$addToSet` to prevent duplicate employees
            await Shift.updateOne(
                { _id: existingShift._id },
                { $addToSet: { assignedEmployees: { $each: assignedEmployees } } }
            );
        } else {
            // Create a new shift if no matching shift exists
            existingShift = new Shift({
                date: shiftDate,
                startTime,
                endTime,
                shiftType,
                assignedEmployees
            });
            await existingShift.save();
        }

        // Update assigned employees' shift lists
        await User.updateMany(
            { _id: { $in: assignedEmployees } },
            { $addToSet: { shifts: existingShift._id } } // Prevent duplicate shift assignments for users
        );

        res.status(200).json({ message: "Shift added successfully", shift: existingShift });
    } catch (error) {
        next(error);
    }
};




 // update a Shift
 export const updateShift = async (req, res, next) => {
    const id = req.params.id; // Extract ID from URL
    const updateData = req.body;

    try {
        // Ensure no duplicate employees in the update
        if (updateData.assignedEmployees) {
            updateData.assignedEmployees = [...new Set(updateData.assignedEmployees)];
        }

        // Find and update the shift
        const update_Shift = await Shift.findByIdAndUpdate(id, updateData, {
            new: true, // Return updated document
            runValidators: true, // Ensure model validation
        });

        if (!update_Shift) {
            return res.status(404).json({ message: "Shift not found" });
        }

        // Update user shift references if assigned employees change
        if (updateData.assignedEmployees) {
            // Remove shift ID from all users
            await User.updateMany(
                { shifts: id },
                { $pull: { shifts: id } }
            );

            // Add shift ID to newly assigned employees
            await User.updateMany(
                { _id: { $in: updateData.assignedEmployees } },
                { $push: { shifts: id } }
            );
        }

        res.status(200).json({ message: "Shift updated successfully", update_shift: update_Shift});
    } catch (error) {
        next(error);
    }
};


// delete Shift
export const deleteShift = async (req, res, next) => { 
    try {
        const shiftId = req.params.id;

        // Find the shift before deleting (to get assigned employees)
        const delete_Shift = await Shift.findById(shiftId);
        if (!delete_Shift) {
            return res.status(404).json({ message: "Shift not found" });
        }

        // Remove shift reference from assigned employees
        await User.updateMany(
            { shifts: shiftId },
            { $pull: { shifts: shiftId } }
        );

        // Now delete the shift
        await Shift.findByIdAndDelete(shiftId);

        res.status(200).json({ message: "Shift deleted successfully" });
    } catch (error) {
        next(error);
    }
};


// get User
export const getShift = async(req, res, next) => { 
    try {
            const get_Shift = await Shift.findById(req.params.id);
    
            if (!get_Shift) {
                return res.status(404).json({ message: "Shift not found" });
            }
            res.status(200).json(get_Shift);
            
        } catch (error) {
            next(error);
        }
};


// get all shift
export const getAllShift = async(req, res, next) => { 
    try {
        const shifts = await Shift.find().populate("assignedEmployees", "firstname email _id"); // Fetch users
       
    
            if (shifts.length === 0) {
                return res.status(404).json({ message: "Empty" });
            }
            res.status(200).json(shifts);
            
        } catch (error) {
            next(error);
        }
};



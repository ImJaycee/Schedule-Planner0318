import express from 'express';
import User from '../models/User.js';
import Shift from '../models/Schedule.js';
import { createError } from '../utils/error.js';




export const CreateShift = async (req, res, next) => {
    try {
        const { date, startTime, endTime, shiftType, assignedEmployees, department, CreatedBy } = req.body;

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
                assignedEmployees,
                department, // Ensure department is set
                CreatedBy
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




export const getShiftonManageShift = async (req, res, next) => { 
    try {
        // Find all shifts where DEPARTMENT matches DEPARTMENT
        const shifts = await Shift.find({
            department: req.params.department 
        }).populate("CreatedBy", "firstname");

        if (shifts.length === 0) {
            return res.status(404).json({ message: "No shifts found for this Admin" });
        }

        res.status(200).json(shifts);
    } catch (error) {
        next(error);
    }
};





// get all shift
export const getAllShift = async(req, res, next) => { 
    try {
        const shifts = await Shift.find()
            .populate("assignedEmployees", "firstname email _id") // Fetch users
            
    
        if (shifts.length === 0) {
            return res.status(404).json({ message: "Empty" });
        }
        res.status(200).json(shifts);
        
        console.log(shifts);
    } catch (error) {
        next(error);
    }
};


export const getAllSpecificDataShiftForUpdate = async (req, res, next) => {
    try {
        const { id, department } = req.params;

        // Fetch the shift by ID and department
        const get_Shift = await Shift.findOne({ _id: id, department });
        if (!get_Shift) {
            return res.status(404).json({ message: "Shift not found" });
        }

        // Fetch all users in the same department
        const usersInDepartment = await User.find({ department });

        if (usersInDepartment.length === 0) {
            return res.status(404).json({ message: "No users found in this department" });
        }

        // Return both the shift and the users in the same department
        res.status(200).json({
            shift: get_Shift,
            users: usersInDepartment,
        });
    } catch (error) {
        next(error);
    }
};


// get all User with speific department create
export const getAllUserByDept = async(req, res, next) => { 
    try {   
            const getAll_User = await User.find({department: req.params.department});
            console.log(req.params.department);
            
            if (getAll_User.length === 0) {
                return res.status(404).json({ message: "Empty" });
            }
            
            return res.send(getAll_User);
            
        } catch (error) {
            next(error);
        }
};

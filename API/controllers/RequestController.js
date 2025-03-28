import express from 'express';
import User from '../models/User.js';
import Shift from '../models/Schedule.js';
import Request from '../models/Request.js';
import { createError } from '../utils/error.js';




export const CreateShiftRequest = async (req, res, next) => {
    try {
        const { date, startTime, endTime, shiftType, status, requestedBy, name, userMessage, adminMessage, currentShift} = req.body;


        let existingRequest = await Request.find({ status: "pending", date, requestedBy });

        if(name === "Unknown Unknown")return next(createError(400, "Invalid request"));

        if (existingRequest.length > 0) {  
            return next(createError(400, "A request for this shift already exists! Please wait for the approval"));
        }
        else {
            let shift_Id = await Shift.findOne({ date, startTime, endTime });
            console.log("Test",shift_Id)
            if (!shift_Id) {  
                return next(createError(404, "Shift not existing!"));
            }
            
            if (shift_Id.shiftType.toLowerCase() === "wfh") {  
                    return next(createError(400, "There is no office schedule on selected date!"));
            }
            if (currentShift === shiftType) {  
                return next(createError(400, "Requesting with same schedule!"));
            }
                // Create a new request shift if no matching request exists
                const shiftId = shift_Id._id
                existingRequest = new Request({
                    date,
                    startTime,
                    endTime,
                    shiftType,
                    requestedBy,
                    name,
                    shiftId,
                    userMessage,
                });
                await existingRequest.save();
            
        }

        res.status(200).json({ message: "Request sent successfully", requestShift: existingRequest });
    } catch (error) {
        next(error);
    }
};




 // update a Request
export const ApprovedRequestShift = async (req, res, next) => {
    try {
        const { requestId, adminMessage} = req.body;

        console.log(req.body)

        // Find the request
        const request = await Request.findById(requestId);
        if (!request) return next(createError(400, "Request not found!"));

        const shiftDate = new Date(request.date).toISOString().split("T")[0];
        const shiftType = request.shiftType;
        const shiftId = request.shiftId;

        // Find the corresponding shift
        const existingShift = await Shift.findById(shiftId);
        if (!existingShift) return res.status(404).json({ message: "Shift not found" });

        // Update assigned employees
        let approved;
            if (shiftType === "on-site") {
                approved = await Shift.updateOne(
                    { _id: existingShift._id },
                    { $addToSet: { assignedEmployees: request.requestedBy } } // Push a single ID, avoiding duplicates
                );
            } else {
                approved = await Shift.updateOne(
                    { _id: existingShift._id },
                    { $pull: { assignedEmployees: request.requestedBy } } // Remove a single ID
                );
            }

        // If shift update was successful, update request status
            if (approved.modifiedCount > 0) {
                const updatedRequest = await Request.findByIdAndUpdate(
                    requestId,
                    { status: "approved", adminMessage: adminMessage },
                    { new: true, runValidators: true }
                );

                return res.status(200).json({
                    message: "Request approved and shift updated successfully",
                    shift: existingShift,
                    request: updatedRequest
                });
            } else {
                return res.status(400).json({ message: "No modifications made to shift" });
            }
    } catch (error) {
        next(error);
    }
};




// reject Shift
export const RejectedRequestShift = async (req, res, next) => { 
    try {
        const { requestId, adminMessage} = req.body;

            const updatedRequest = await Request.findByIdAndUpdate(
                requestId,
                { status: "rejected", adminMessage: adminMessage },
                { new: true, runValidators: true }
            );
            if(updatedRequest){
                return res.status(200).json({ message: "Request rejected! Shift updated successfully",});
            }else{
                return res.status(404).json({ message: "Shift not found" });
            }
    } catch (error) {
        next(error);
    }
};


// get User
export const getRequestShift = async(req, res, next) => { 
    try {
        const get_request = await Request.find({ requestedBy: req.params.id });
    
            if (!get_request) {
                return res.status(404).json({ message: "Request not found" });
            }
            res.status(200).json(get_request);

            
        } catch (error) {
            next(error);
        }
};


// get all Request
export const getAllRequest = async(req, res, next) => { 
    try {
        const requests = await Request.find().populate("name", "firstname");; // Fetch requests
       
    
            if (requests.length === 0) {
                return res.status(404).json({ message: "Empty" });
            }
            res.status(200).json(requests);
            
        } catch (error) {
            next(error);
        }
};



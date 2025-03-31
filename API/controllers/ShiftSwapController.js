import express from 'express';
import User from '../models/User.js';
import Shift from '../models/Schedule.js';
import Request from '../models/Request.js';
import RequestSwap from '../models/RequestSwap.js';
import { createError } from '../utils/error.js';




export const CreateShiftSwapRequest = async (req, res, next) => {
    try {
        const {date, RecipientST, RequesterST, requestedBy, requestedTo, requesterName, requestingShiftId, requesterShiftId, requesterMessage} = req.body;


        let existingRequest = await RequestSwap.find({ status: "pending", date, requestingShiftId, requesterShiftId, requestedBy, requestedTo });

        if(requesterName === "Unknown Unknown")return next(createError(400, "Invalid request"));
        const requestShift = await Shift.findById(requestingShiftId);
        if (requestShift) {
            const isRequestedByIncluded = requestShift.assignedEmployees.includes(requestedBy);
            const isRequestedToIncluded = requestShift.assignedEmployees.includes(requestedTo);
        
            if (isRequestedByIncluded && isRequestedToIncluded) {
                return next(createError(400, "You cannot request a swap when both employees are already on the same schedule."));
            }
        
            if (!isRequestedByIncluded && !isRequestedToIncluded) {
                return next(createError(400, "Both employees are WFH on this shift. No swap is needed."));
            }
        }
        
        const offerShift = await Shift.findById(requesterShiftId);
        if (offerShift) {
            const isRequestedByIncluded = offerShift.assignedEmployees.includes(requestedBy);
            const isRequestedToIncluded = offerShift.assignedEmployees.includes(requestedTo);
        
            if (isRequestedByIncluded && isRequestedToIncluded) {
                return next(createError(400, "Your offered shift already includes both employees. You cannot send a request for the same schedule."));
            }
        
            if (!isRequestedByIncluded && !isRequestedToIncluded) {
                return next(createError(400, "Both employees are WFH on this shift. No swap is needed."));
            }
        }

        if (existingRequest.length > 0) {  
            return next(createError(400, "A request for this shift already exists! Please wait for the approval"));
        }
        else {
            let shift_Id = await Shift.findById(requestingShiftId?.toString()); 
            console.log("Test",shift_Id)
            if (!shift_Id) {  
                return next(createError(404, "Shift not existing!"));
            }
            
            if (shift_Id.shiftType.toLowerCase() === "wfh") {  
                    return next(createError(400, "There is no office schedule on selected date!"));
            }
                existingRequest = new RequestSwap({
                    date,
                    RecipientST,
                    RequesterST,
                    requestedBy,
                    requestedTo,
                    requesterName,
                    requestingShiftId,
                    requesterShiftId,
                    requesterMessage,
                });
                 await existingRequest.save();
                
        }

         res.status(200).json({ message: "Request sent successfully", requestSwapShift: existingRequest });
    } catch (error) {
        next(error);
    }
};




 // Accept a Swap RequestApprovedSwapRequestAdmin
export const AcceptSwapRequestShift = async (req, res, next) => {
    try {
        const { requestSwapId, recipientMessage } = req.body;

        console.log("Incoming Data:", req.body);

        // Find the request
        const request = await RequestSwap.findById(requestSwapId);
        if (!request) return next(createError(400, "Request not found!"));

        const RequestingshiftId = request.requestingShiftId;
        const RequestershiftId = request.requesterShiftId;

        // Find the corresponding shifts
        const existingRequestShift = await Shift.findById(RequestingshiftId);
        const existingOfferShift = await Shift.findById(RequestershiftId);
        if (!existingRequestShift || !existingOfferShift) {
            return res.status(404).json({ message: "Invalid request. Shift not found." });
        }

        // Update recipientStatus to "accepted"
        const requestAccept = await RequestSwap.findByIdAndUpdate(
            requestSwapId,
            { recipientStatus: "accepted", recipientMessage },
            { new: true, runValidators: true }
        );

        if (requestAccept) {
            return res.status(200).json({
                message: "Request accepted! Shift updated successfully",
                data: requestAccept
            });
        } else {
            return res.status(400).json({ message: "Request Invalid" });
        }
    } catch (error) {
        next(error);
    }
};

 // Accept a Swap Request
 export const DeclineSwapRequestShift = async (req, res, next) => {
    try {
        const { requestSwapId, recipientMessage } = req.body;

        console.log("Incoming Data:", req.body);

        // Find the request
        const request = await RequestSwap.findById(requestSwapId);
        if (!request) return next(createError(400, "Request not found!"));

        const RequestingshiftId = request.requestingShiftId;
        const RequestershiftId = request.requesterShiftId;

        // Find the corresponding shifts
        const existingRequestShift = await Shift.findById(RequestingshiftId);
        const existingOfferShift = await Shift.findById(RequestershiftId);
        if (!existingRequestShift || !existingOfferShift) {
            return res.status(404).json({ message: "Invalid request. Shift not found." });
        }

        // Update recipientStatus to "accepted"
        const requestDecline = await RequestSwap.findByIdAndUpdate(
            requestSwapId,
            { recipientStatus: "rejected", status: "rejected", recipientMessage },
            { new: true, runValidators: true }
        );

        if (requestDecline) {
            return res.status(200).json({
                message: "Request declined! Shift updated successfully",
                data: requestDecline
            });
        } else {
            return res.status(400).json({ message: "Request Invalid" });
        }
    } catch (error) {
        next(error);
    }
};


// get send request
export const getSendRequestShift = async(req, res, next) => { 
    try {
        const get_request = await RequestSwap.find({ requestedBy: req.params.id })
                                                    .populate("requestedTo", "firstname")
                                                    .populate("requestingShiftId", "date");

    
            if (!get_request) {
                return res.status(404).json({ message: "Request not found" });
            }
            res.status(200).json(get_request);

            
        } catch (error) {
            next(error);
        }
};

// get receive
export const getReceivedRequestShift = async(req, res, next) => { 
    try {
        const get_request = await RequestSwap.find({ requestedTo: req.params.id })
                                                    .populate("requestedBy", "firstname")
                                                    .populate("requestingShiftId", "date")
                                                    .populate("requesterShiftId", "date");

    
            if (!get_request) {
                return res.status(404).json({ message: "Request not found" });
            }
            res.status(200).json(get_request);

            
        } catch (error) {
            next(error);
        }
};


// ------------------------ADMIN

// Accept a Swap Request
export const ApprovedSwapRequestAdmin = async (req, res, next) => {
    try {
        const { requestSwapId, adminMessage } = req.body;

        console.log("Incoming Data:", req.body);

        // Find the request
        const request = await RequestSwap.findById(requestSwapId);
        if (!request) return next(createError(400, "Request not found!"));

        const { requestingShiftId, requesterShiftId, requestedTo, requestedBy, RecipientST, RequesterST } = request;

        // Find the corresponding shifts
        const existingRequestShift = await Shift.findById(requestingShiftId);
        const existingOfferShift = await Shift.findById(requesterShiftId);
        if (!existingRequestShift || !existingOfferShift) {
            return res.status(404).json({ message: "Invalid request. Shift not found." });
        }

        // Handle swap conditions
        if (RecipientST === "on-site") {
            // Remove requestedTo from requested shift first
            await Shift.updateOne(
                { _id: existingRequestShift._id },
                { $pull: { assignedEmployees: requestedTo } }
            );
            
            // Then add requestedBy to requested shift
            await Shift.updateOne(
                { _id: existingRequestShift._id },
                { $addToSet: { assignedEmployees: requestedBy } }
            );

            if (RequesterST === "on-site") {
                // Remove requestedBy from offered shift first
                await Shift.updateOne(
                    { _id: existingOfferShift._id },
                    { $pull: { assignedEmployees: requestedBy } }
                );

                // Then add requestedTo to the offered shift
                await Shift.updateOne(
                    { _id: existingOfferShift._id },
                    { $addToSet: { assignedEmployees: requestedTo } }
                );
            }
            if (RequesterST === "wfh") {
                // Remove requestedTo from offered shift first
                await Shift.updateOne(
                    { _id: existingOfferShift._id },
                    { $pull: { assignedEmployees: requestedTo } }
                );
            }
        } 
        else if (RecipientST === "wfh" && RequesterST === "on-site") {
            // Remove requestedBy from offered shift first
            await Shift.updateOne(
                { _id: existingOfferShift._id },
                { $pull: { assignedEmployees: requestedBy } }
            );

            // Then add requestedTo to the offered shift
            await Shift.updateOne(
                { _id: existingOfferShift._id },
                { $addToSet: { assignedEmployees: requestedTo } }
            );
        } 
        else if (RecipientST === "wfh" && RequesterST === "wfh") {
            await RequestSwap.updateOne(
                {_id: requestSwapId},
                {status: "approved", adminMessage: adminMessage},
            );
            return res.status(200).json({ message: "Both employees are on WFH schedule; no update needed." });
        }

        await RequestSwap.updateOne(
            {_id: requestSwapId},
            {status: "approved", adminMessage: adminMessage}
        );

        return res.status(200).json({ message: "Swap Approved", data: request });

    } catch (error) {
        console.error("Error Approving shift:", error);
        next(error);
    }
};


 // decline a Swap Request
 export const DeclineSwapAdmin = async (req, res, next) => {
    try {
        const { requestSwapId, adminMessage } = req.body;

        // Find the request
        const request = await RequestSwap.findById(requestSwapId);
        if (!request) return next(createError(400, "Request not found!"));

        const RequestingshiftId = request.requestingShiftId;
        const RequestershiftId = request.requesterShiftId;

        // Find the corresponding shifts
        const existingRequestShift = await Shift.findById(RequestingshiftId);
        const existingOfferShift = await Shift.findById(RequestershiftId);
        if (!existingRequestShift || !existingOfferShift) {
            return res.status(404).json({ message: "Invalid request. Shift not found." });
        }

        // Update recipientStatus to "accepted"
        const requestDecline = await RequestSwap.findByIdAndUpdate(
            requestSwapId,
            { status: "rejected", adminMessage },
            { new: true, runValidators: true }
        );

        if (requestDecline) {
            return res.status(200).json({
                message: "Request accepted! Shift updated successfully",
                data: requestDecline
            });
        } else {
            return res.status(400).json({ message: "Request Invalid" });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllSwapRequest = async (req, res, next) => {
    try {
        const get_request = await RequestSwap.find()
                                                    .populate("requestingShiftId", "date")
                                                    .populate("requesterShiftId", "date")
                                                    .populate("requestedBy", "firstname lastname")
                                                    .populate("requestedTo", "firstname lastname");

    
            if (!get_request) {
                return res.status(404).json({ message: "Request not found" });
            }
            res.status(200).json(get_request);

            
        } catch (error) {
            next(error);
        }
};




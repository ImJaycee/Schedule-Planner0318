import express from 'express';
import User from '../models/User.js';
import Shift from '../models/Schedule.js';
import Request from '../models/Request.js';
import RequestSwap from '../models/RequestSwap.js';
import { createError } from '../utils/error.js';

import { sendNotificationEmailAdmin, sendNotificationSwapRecipient, sendNotificationSwapSender } from '../utils/adminEmailNotification.js';

import { sendEmail } from '../utils/employee-emailNotification.js';

export const CreateShiftSwapRequest = async (req, res, next) => {
    try {
        const { date, RecipientST, RequesterST, requestedBy, requestedTo, requesterName, requestingShiftId, requesterShiftId, requesterMessage } = req.body;

        let existingRequest = await RequestSwap.find({ status: "pending", date, requestingShiftId, requesterShiftId, requestedBy, requestedTo });

        if (requesterName === "Unknown Unknown") return next(createError(400, "Invalid request"));

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
        } else {
            let shift_Id = await Shift.findById(requestingShiftId?.toString());
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

            // Fetch emails of requestedBy and requestedTo
            const requester = await User.findById(requestedBy);
            const recipient = await User.findById(requestedTo);

            if (!requester || !recipient) {
                return next(createError(404, "Requester or Recipient not found!"));
            }

            const requesterEmail = requester.email;
            const recipientEmail = recipient.email;

            // Prepare email content
            const subject = 'Shift Swap Request Notification';
            const htmlContent = `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2 style="color: #007BFF;">New Shift Swap Request Created</h2>
                            <p>A new shift swap request has been created.</p>
                            <p><strong>Details:</strong></p>
                            <ul>
                            <li><strong>Requester:</strong> ${requester.firstname} ${requester.lastname} </li>
                            <li><strong>Recipient:</strong> ${recipient.firstname} ${recipient.lastname} </li>
                            <li><strong>Date:</strong> ${new Date(date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</li>
                            <li><strong>Requester Message:</strong> ${requesterMessage || 'No message provided'}</li>
                            </ul>
                            <p>Click the link below to review the request:</p>
                            <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Review Request</a>
                            <p style="margin-top: 20px;">Thank you!</p>
                        </div>
                        `;

            // Send email to both requester and recipient
            try {
                await sendEmail(requesterEmail, subject, htmlContent);
                await sendEmail(recipientEmail, subject, htmlContent);
                console.log('Emails sent successfully');
            } catch (emailError) {
                console.error('Error sending emails:', emailError);
            }
        }

        res.status(200).json({ message: "Request sent successfully and email notifications sent", requestSwapShift: existingRequest });
    } catch (error) {
        next(error);
    }
};



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
            // Fetch requester and recipient details
            const requester = await User.findById(request.requestedBy);
            const recipient = await User.findById(request.requestedTo);

            if (!requester || !recipient) {
                return next(createError(404, "Requester or Recipient not found!"));
            }

            const requesterEmail = requester.email;
            const recipientEmail = recipient.email;

            // Fetch admin(s) of the same department, excluding the recipient
            const departmentAdmins = await User.find({
                department: recipient.department,
                isAdmin: true,
                email: { $ne: recipientEmail }, // Exclude recipient's email
            });
            const adminEmails = departmentAdmins.map(admin => admin.email);

            // Prepare email content
            let subject = 'Shift Swap Request Accepted';
            let htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #007BFF;">Shift Swap Request Accepted</h2>
                    <p>The shift swap request has been accepted.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                        <li><strong>Requester:</strong> ${requester.firstname} ${requester.lastname}</li>
                        <li><strong>Recipient:</strong> ${recipient.firstname} ${recipient.lastname}</li>
                        <li><strong>Date:</strong> ${new Date(request.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}</li>
                        <li><strong>Recipient Message:</strong> ${recipientMessage || 'No message provided'}</li>
                    </ul>
                    <p>Thank you!</p>
                </div>
            `;

            // If the recipient is an admin, modify the email content
            if (recipient.isAdmin) {
                subject = 'Admin Notification: Shift Swap Request Accepted';
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #007BFF;">Admin Notification: Shift Swap Request Accepted</h2>
                        <p>A shift swap request has been accepted in your department.</p>
                        <p><strong>Details:</strong></p>
                        <ul>
                            <li><strong>Requester:</strong> ${requester.firstname} ${requester.lastname}</li>
                            <li><strong>Recipient:</strong> ${recipient.firstname} ${recipient.lastname}</li>
                            <li><strong>Date:</strong> ${new Date(request.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</li>
                            <li><strong>Recipient Message:</strong> ${recipientMessage || 'No message provided'}</li>
                        </ul>
                        <p>Please review the request and take any necessary actions.</p>
                        <p>Thank you!</p>
                    </div>
                `;
            }

            // Send email to requester, recipient, and admins
            try {
                // Send email to requester
                await sendEmail(requesterEmail, subject, htmlContent);

                // Send email to recipient
                await sendEmail(recipientEmail, subject, htmlContent);

                // Send email to all admins in the department (excluding recipient)
                for (const adminEmail of adminEmails) {
                    await sendEmail(adminEmail, subject, htmlContent);
                }

                console.log('Emails sent successfully to requester, recipient, and admins');
            } catch (emailError) {
                console.error('Error sending emails:', emailError);
            }

            return res.status(200).json({
                message: "Request accepted! Shift updated successfully and email notifications sent.",
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

        // Update recipientStatus to "rejected"
        const requestDecline = await RequestSwap.findByIdAndUpdate(
            requestSwapId,
            { recipientStatus: "rejected", status: "rejected", recipientMessage },
            { new: true, runValidators: true }
        );

        if (requestDecline) {
            // Fetch requester and recipient details
            const requester = await User.findById(request.requestedBy);
            const recipient = await User.findById(request.requestedTo);

            if (!requester || !recipient) {
                return next(createError(404, "Requester or Recipient not found!"));
            }

            const requesterEmail = requester.email;
            const recipientEmail = recipient.email;

            // Prepare email content
            const subject = 'Shift Swap Request Declined';
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #FF0000;">Shift Swap Request Declined</h2>
                    <p>The shift swap request has been declined.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                        <li><strong>Requester:</strong> ${requester.firstname} ${requester.lastname} </li>
                        <li><strong>Recipient:</strong> ${recipient.firstname} ${recipient.lastname} </li>
                        <li><strong>Date:</strong> ${new Date(request.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}</li>
                        <li><strong>Recipient Message:</strong> ${recipientMessage || 'No message provided'}</li>
                    </ul>
                    <p>Thank you!</p>
                </div>
            `;

            // Send email to both requester and recipient
            try {
                await sendEmail(requesterEmail, subject, htmlContent);
                await sendEmail(recipientEmail, subject, htmlContent);
                console.log('Emails sent successfully');
            } catch (emailError) {
                console.error('Error sending emails:', emailError);
            }

            return res.status(200).json({
                message: "Request declined! Shift updated successfully and email notifications sent.",
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
        const request = await RequestSwap.findById(requestSwapId)
                                                                .populate("requestedBy", "email firstname")  // Fetch only the email field from the User model
                                                                .populate("requestedTo", "email firstname lastname");
        if (!request) return next(createError(400, "Request not found!"));

        const { requestingShiftId, requesterShiftId, requestedTo, requestedBy, RecipientST, RequesterST } = request;

        // Find the corresponding shifts
        const existingRequestShift = await Shift.findById(requestingShiftId);
        const existingOfferShift = await Shift.findById(requesterShiftId);
        if (!existingRequestShift || !existingOfferShift) {
            return res.status(404).json({ message: "Invalid request. Shift not found." });
        }

        
        const requesterEmail = request.requestedBy.email
        const recipientEmail = request.requestedTo.email
        const requesterName = request.requesterName
        const recipientName = request.requestedTo.firstname + " " + request.requestedTo.lastname
        const RequestshiftDate = new Date(existingRequestShift.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const OffershiftDate = new Date(existingOfferShift.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        

       


        // Handle swap conditions
        if (RecipientST === "on-site") {
            // Remove requestedTo from requested shift first
            await Shift.updateOne(
                { _id: existingRequestShift._id },
                { $pull: { assignedEmployees: requestedTo._id } }
            );
            
            // Then add requestedBy to requested shift
            await Shift.updateOne(
                { _id: existingRequestShift._id },
                { $addToSet: { assignedEmployees: requestedBy._id } }
            );

            if (RequesterST === "on-site") {
                // Remove requestedBy from offered shift first
                await Shift.updateOne(
                    { _id: existingOfferShift._id },
                    { $pull: { assignedEmployees: requestedBy._id } }
                );

                // Then add requestedTo to the offered shift
                await Shift.updateOne(
                    { _id: existingOfferShift._id },
                    { $addToSet: { assignedEmployees: requestedTo._id } }
                );
            }
            if (RequesterST === "wfh") {
                // Remove requestedTo from offered shift first
                await Shift.updateOne(
                    { _id: existingOfferShift._id },
                    { $pull: { assignedEmployees: requestedTo._id } }
                );
            }
        } 
        else if (RecipientST === "wfh" && RequesterST === "on-site") {
            // Remove requestedBy from offered shift first
            await Shift.updateOne(
                { _id: existingOfferShift._id },
                { $pull: { assignedEmployees: requestedBy._id } }
            );

            // Then add requestedTo to the offered shift
            await Shift.updateOne(
                { _id: existingOfferShift._id },
                { $addToSet: { assignedEmployees: requestedTo._id } }
            );
        } 
        else if (RecipientST === "wfh" && RequesterST === "wfh") {
            await RequestSwap.updateOne(
                {_id: requestSwapId},
                {status: "approved", adminMessage: adminMessage},
            );
            return res.status(200).json({ message: "Both employees are on WFH schedule; no update needed." });
        }

        const approved = await RequestSwap.updateOne(
            {_id: requestSwapId},
            {status: "approved", adminMessage: adminMessage}
        );

        if(approved && recipientEmail && requesterEmail){
            sendNotificationSwapSender(requesterEmail, "approved", recipientName, RequesterST, RecipientST, RequestshiftDate, OffershiftDate);
            sendNotificationSwapRecipient(recipientEmail, "approved", requesterName, RequesterST, RecipientST, RequestshiftDate, OffershiftDate);
        }

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
        const request = await RequestSwap.findById(requestSwapId)
                                                                .populate("requestedBy", "email firstname")  // Fetch only the email field from the User model
                                                                .populate("requestedTo", "email firstname lastname");
        if (!request) return next(createError(400, "Request not found!"));

        const RequestingshiftId = request.requestingShiftId;
        const RequestershiftId = request.requesterShiftId;

        // Find the corresponding shifts
        const existingRequestShift = await Shift.findById(RequestingshiftId);
        const existingOfferShift = await Shift.findById(RequestershiftId);
        if (!existingRequestShift || !existingOfferShift) {
            return res.status(404).json({ message: "Invalid request. Shift not found." });
        }

        const requesterEmail = request.requestedBy.email
        const recipientEmail = request.requestedTo.email
        const requesterName = request.requesterName
        const recipientName = request.requestedTo.firstname + " " + request.requestedTo.lastname
        const RequestshiftDate = new Date(existingRequestShift.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const OffershiftDate = new Date(existingOfferShift.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Update recipientStatus to "accepted"
        const requestDecline = await RequestSwap.findByIdAndUpdate(
            requestSwapId,
            { status: "rejected", adminMessage },
            { new: true, runValidators: true }
        );

        if (requestDecline) {
            if(requesterEmail && recipientEmail){
                sendNotificationSwapSender(requesterEmail, "rejected", recipientName, request.RequesterST, request.RecipientST, RequestshiftDate, OffershiftDate);
                sendNotificationSwapRecipient(recipientEmail, "rejected", requesterName, request.RequesterST, request.RecipientST, RequestshiftDate, OffershiftDate);
            }
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


export const getAllUserByDepartmentReqSwap = async(req, res, next) => { 
    try {   
        const getAll_User = await User.find({department: req.params.department});
        console.log(req.params.department);
        
        if (getAll_User.length === 0) {
            return res.status(404).json({ message: "Empty" });
        }
        console.log(getAll_User)
        return res.send(getAll_User);
        
    } catch (error) {
        console.log("Error at controller",error)
        next(error);
        
    }
};


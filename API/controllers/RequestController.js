import express from "express";
import User from "../models/User.js";
import Shift from "../models/Schedule.js";
import Request from "../models/Request.js";
import { createError } from "../utils/error.js";
import { sendNotificationEmailAdmin } from "../utils/adminEmailNotification.js";

import { sendEmail } from "../utils/employee-emailNotification.js";

export const CreateShiftRequest = async (req, res, next) => {
  try {
    const {
      date,
      startTime,
      endTime,
      shiftType,
      requestedBy,
      name,
      userMessage,
      currentShift,
      department,
    } = req.body;

    // Check for existing requests
    let existingRequest = await Request.find({
      status: "pending",
      date,
      requestedBy,
    });

    if (name === "Unknown Unknown")
      return next(createError(400, "Invalid request"));

    if (existingRequest.length > 0) {
      return next(
        createError(
          400,
          "A request for this shift already exists! Please wait for the approval"
        )
      );
    }

    // Check if the shift exists
    let shift_Id = await Shift.findOne({ date, startTime, endTime });
    if (!shift_Id) {
      return next(createError(404, "Shift not existing!"));
    }

    if (shift_Id.shiftType.toLowerCase() === "wfh") {
      return next(
        createError(400, "There is no office schedule on selected date!")
      );
    }
    if (currentShift === shiftType) {
      return next(createError(400, "Requesting with same schedule!"));
    }

    // Create a new request shift
    const shiftId = shift_Id._id;
    const newRequest = new Request({
      date,
      startTime,
      endTime,
      shiftType,
      requestedBy,
      name,
      shiftId,
      userMessage,
    });

    await newRequest.save(); // Save the request to the database

    if (!department) {
      return next(createError(400, "Department is required"));
    }

    // Format the date for the email
    const shiftDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Find admins in the same department
    const admins = await User.find({ isAdmin: true, department });
    const adminEmails = admins.map((admin) => admin.email);

    // Send email to all admins if any are found
    if (adminEmails.length > 0) {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007BFF;">New Shift Request Created</h2>
          <p>A new shift request has been created by <strong>${name}</strong>.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Date:</strong> ${shiftDate}</li>
            <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
            <li><strong>Shift Type:</strong> ${shiftType}</li>
            <li><strong>Message:</strong> ${
              userMessage || "No message provided"
            }</li>
          </ul>
          <p>Click the link below to review the request:</p>
          <a href="http://localhost:5173/admin/request-shift" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Review Request</a>
          <p style="margin-top: 20px;">Thank you!</p>
        </div>
      `;

      await sendEmail(adminEmails, "New Shift Request Created", emailContent);
    }

    // Respond with success
    res
      .status(200)
      .json({ message: "Request sent successfully", requestShift: newRequest });
  } catch (error) {
    next(error);
  }
};

// update a Request
export const ApprovedRequestShift = async (req, res, next) => {
  try {
    const { requestId, adminMessage } = req.body;

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) return next(createError(400, "Request not found!"));

    const shiftDate = new Date(request.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shiftType = request.shiftType;
    const shiftId = request.shiftId;

    // Find user email
    const userFind = await User.findById(request.requestedBy);
    const EmployeeEmail = userFind ? userFind.email : null;

    // Find the corresponding shift
    const existingShift = await Shift.findById(shiftId);
    if (!existingShift)
      return res.status(404).json({ message: "Shift not found" });

    // Update assigned employees
    let updateQuery =
      shiftType === "on-site"
        ? { $addToSet: { assignedEmployees: request.requestedBy } }
        : { $pull: { assignedEmployees: request.requestedBy } };

    const approved = await Shift.updateOne({ _id: shiftId }, updateQuery);

    // Check if update was acknowledged
    if (approved && approved.acknowledged) {
      const updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        { status: "approved", adminMessage },
        { new: true, runValidators: true }
      );

      // Send email if EmployeeEmail exists
      if (EmployeeEmail) {
        sendNotificationEmailAdmin(
          EmployeeEmail,
          "approved",
          shiftType,
          shiftDate
        );
      }

      return res.status(200).json({
        message: "Request approved and shift updated successfully",
        shift: existingShift,
        request: updatedRequest,
      });
    } else {
      return res
        .status(400)
        .json({ message: "No modifications made to shift" });
    }
  } catch (error) {
    next(error);
  }
};

// reject Shift
export const RejectedRequestShift = async (req, res, next) => {
  try {
    const { requestId, adminMessage } = req.body;

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) return next(createError(400, "Request not found!"));

    const shiftDate = new Date(request.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shiftType = request.shiftType;
    const shiftId = request.shiftId;

    // Find user email
    const userFind = await User.findById(request.requestedBy);
    const EmployeeEmail = userFind ? userFind.email : null;

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status: "rejected", adminMessage: adminMessage },
      { new: true, runValidators: true }
    );
    // Send email if EmployeeEmail exists
    if (EmployeeEmail) {
      sendNotificationEmailAdmin(
        EmployeeEmail,
        "rejected",
        shiftType,
        shiftDate
      );
    }
    if (updatedRequest) {
      return res
        .status(200)
        .json({ message: "Request rejected! Shift updated successfully" });
    } else {
      return res.status(404).json({ message: "Shift not found" });
    }
  } catch (error) {
    next(error);
  }
};

// get User
export const getRequestShift = async (req, res, next) => {
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
export const getAllRequest = async (req, res, next) => {
  try {
    const requests = await Request.find().populate("name", "firstname"); // Fetch requests

    if (requests.length === 0) {
      return res.status(404).json({ message: "Empty" });
    }
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

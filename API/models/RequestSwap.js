import mongoose from "mongoose";

const RequestsShiftSwapSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    RecipientST: {
      type: String,
      enum: ["wfh", "on-site"],
      required: true,
    },
    RequesterST: {
      // Requester's original shift
      type: String,
      enum: ["wfh", "on-site"],
      required: true,
    },
    recipientStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // Changed "approved" to "accepted" for consistency
      default: "pending",
    },
    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    requestingShiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    requesterShiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    requesterMessage: {
      type: String,
      default: "",
    },
    recipientMessage: {
      type: String,
      default: "",
    },
    adminMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShiftSwap", RequestsShiftSwapSchema);

import mongoose from 'mongoose';

const RequestsShiftSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  shiftType: { 
    type: String, 
    enum: ["wfh", "on-site"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  requestedBy: { // employee ID
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  shiftId:{
    type: String, 
    required: true 
  },
  userMessage: { // employee reason
    type: String, 
    default: "" 
  },
  adminMessage: { // admin status message
    type: String, 
    default: "" 
  },

}, { timestamps: true });

export default mongoose.model("RequestsShift", RequestsShiftSchema);

import mongoose from 'mongoose';

const ShiftSchema = new mongoose.Schema({
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
department: {
    type: String, // or mongoose.Schema.Types.ObjectId if referencing another collection
    required: true,
},
CreatedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
},
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


export default mongoose.model("Shift", ShiftSchema);
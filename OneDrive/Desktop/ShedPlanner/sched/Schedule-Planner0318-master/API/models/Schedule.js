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
    enum: ["morning", "night"], 
    required: true 
},
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


export default mongoose.model("Shift", ShiftSchema);
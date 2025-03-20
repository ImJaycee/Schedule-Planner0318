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
<<<<<<< HEAD
    enum: ["morning", "night"], 
=======
    enum: ["wfh", "on-site"], 
>>>>>>> origin/request-process
    required: true 
},
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


export default mongoose.model("Shift", ShiftSchema);
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    department: { 
        type: String,
        required: true,
    },
    password: { 
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },  
    image:{
        type: String,
        default: ''},
    // verificationCode: { type: String }, // 6-digit email verification code
    verificationToken: { type: String }, // Unique verification token
    verificationExpires: { type: Date }, // Expiration time for both    
  },
  {timestamps: true}
);

  export default mongoose.model("User", UserSchema)
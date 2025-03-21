import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto'; // For generating a secure token
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from '../utils/error.js';

dotenv.config()

const accessToken = process.env.JWT_SECRET

// Generate a random 6-digit code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate a secure token
const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');


export const Register = async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      const verificationCode = generateVerificationCode();
      const verificationToken = generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      const hashedToken = bcrypt.hashSync(verificationToken, 10);
  
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        department: req.body.department,
        password: hash,
        isAdmin:  false,
        verificationToken: hashedToken,
        verificationExpires,
      });

      const user = await User.findOne({email: req.body.email})
      if(user) return next(createError(400, "Email already in use"))
  
      await newUser.save();
  
      // Send email with both code and link
      await sendVerificationEmail(req.body.email, verificationToken); // add verification code if needed
  
      res.status(200).json({ message: "User registered successfully. Check your email to verify your account." });
    } catch (error) {
      next(error);
    }
  };

  export const RegisterAdmin = async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      const verificationCode = generateVerificationCode();
      const verificationToken = generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 1 * 60 * 1000); // 10 minutes expiry
      const hashedToken = bcrypt.hashSync(verificationToken, 10);
  
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        department: req.body.department,
        password: hash,
        isAdmin: true,
        verificationToken: hashedToken,
        verificationExpires,
      });

      const user = await User.findOne({email: req.body.email})
      if(user) return next(createError(400, "Email already in use"))
  
      await newUser.save();
  
      // Send email with both code and link
      await sendVerificationEmailAdmin(req.body.email, verificationToken); // add verification code if needed
  
      res.status(200).json({ message: "Admin registered successfully. Check your email to verify your account." });
    } catch (error) {
      next(error);
    }
  };

    // Function to send verification for admin email
const sendVerificationEmailAdmin = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:4000/api/auth/verifyadmin?token=${token}`;

  const mailOptions = {
    from: `"Schedule App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Verify Your Email</h2>

          <p style="font-size: 16px; color: #555; text-align: center;">Click the button below to verify your email:</p>

          <p style="text-align: center;">
              <a href="${verificationLink}" style="display: inline-block; font-size: 16px; color: #fff; background-color: #3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          </p>

          <p style="font-size: 14px; color: #777; text-align: center;">This link expires in <strong>10 minutes</strong>.</p>
      </div>

    `,
  };

  await transporter.sendMail(mailOptions);
};

  // Function to send verification for users email
const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const verificationLink = `http://localhost:4000/api/auth/verify?token=${token}`;
  
    const mailOptions = {
      from: `"Schedule App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Verify Your Email</h2>

            <p style="font-size: 16px; color: #555; text-align: center;">Click the button below to verify your email:</p>

            <p style="text-align: center;">
                <a href="${verificationLink}" style="display: inline-block; font-size: 16px; color: #fff; background-color: #3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
            </p>

            <p style="font-size: 14px; color: #777; text-align: center;">This link expires in <strong>10 minutes</strong>.</p>
        </div>

      `,
    };
  
    await transporter.sendMail(mailOptions);
  };


  export const Login = async(req, res, next) => { 
    if(req.body.email === "" || req.body.password === "") return next(createError(404, "Please enter your email and Password"))
      try {
          const user = await User.findOne({email: req.body.email})
          if (!user) return next(createError(404, "User not found"))
          if (!user.isVerified) {
              if (user.verificationExpires.getTime() < Date.now()) {  
                  try {
                      const delUser = await User.findOneAndDelete({ email: req.body.email });
                      if (delUser) return next(createError(400, "Email failed to verify, account deleted"));
                  } catch (error) {
                      return next(error);
                  }
              } else {
                return next(createError(400, "Please verify your email"));
              }
          }
  
          const passwordCorrect = await bcrypt.compare(req.body.password, user.password);
          if(!passwordCorrect) 
            return next(createError(403, "Incorrect password"))
  
          const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
          
          const userDetails = user.toObject ? user.toObject() : user;
  
          const { password, isAdmin, ...otherDetails } = userDetails; 
  
          console.log(otherDetails);
  
          res.cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json({accessToken: token, success: true, message: "Login successful!", userId: user._id, user: otherDetails });
      } catch (err) {
       next(err);
      }
   };
  
   export const LoginAdmin = async(req, res, next) => { 
    if(req.body.email === "" || req.body.password === "") return next(createError(404, "Please enter your email and Password"))
      try {
          const user = await User.findOne({email: req.body.email})
          if (!user) return next(createError(404, "User not found"))
          if (!user.isVerified) {
              if (user.verificationExpires.getTime() < Date.now()) {  
                  try {
                      const delUser = await User.findOneAndDelete({ email: req.body.email });
                      if (delUser) return next(createError(400, "Email failed to verify, account deleted"));
                  } catch (error) {
                      return next(error);
                  }
              } else {
                return next(createError(400, "Please verify your email"));
              }
          }
          if (!user.isAdmin) return next(createError(403,'Your are not allowed.'));
          
          const passwordCorrect = await bcrypt.compare(req.body.password, user.password);
          if(!passwordCorrect) 
            return next(createError(403, "Incorrect password"))
  
          const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
          
          const userDetails = user.toObject ? user.toObject() : user;
  
          const { password, ...otherDetails } = userDetails; 
  
          console.log(otherDetails);
  
          res.cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json({accessToken: token, success: true, message: "Login successful!", userId: user._id, user: otherDetails });
      } catch (err) {
       next(err);
      }
   };
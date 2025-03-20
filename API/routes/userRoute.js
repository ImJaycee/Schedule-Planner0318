import express from 'express';
import {  deleteUser, getAllUser, getUser, updateUser } from '../controllers/UserController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';


const router = express.Router();


//User Router
router.put("/:id", verifyUser, updateUser) //update
router.delete("/:id", verifyUser, deleteUser) //delete
router.get("/:id", verifyUser, getUser) //get
router.get("/", verifyAdmin, getAllUser) //get all

export default router
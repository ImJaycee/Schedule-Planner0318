import express from 'express';
import {  deleteUser, getAllUser, getAllUserByDept, getUser, updateUser } from '../controllers/UserController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';


const router = express.Router();


//User Router
router.put("/:id", verifyUser, updateUser) //update
router.delete("/:id", verifyUser, deleteUser) //delete
router.get("/:id", verifyUser, getUser) //get
router.get("/", verifyAdmin, getAllUser) //get all
router.get("/all/:department", verifyUser, getAllUserByDept) //get all

export default router
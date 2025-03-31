import express from 'express';
import {  deleteUser, getAllUser, getAllUserSwap, getUser, updateUser } from '../controllers/UserController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';


const router = express.Router();


//User Router
router.put("/:id", verifyUser, updateUser) //update
router.delete("/:id", verifyUser, deleteUser) //delete
router.get("/:id", verifyUser, getUser) //get
router.get("/", verifyUser, getAllUser) //get all

router.get("/user-swap", verifyUser, getAllUserSwap) //get all

export default router
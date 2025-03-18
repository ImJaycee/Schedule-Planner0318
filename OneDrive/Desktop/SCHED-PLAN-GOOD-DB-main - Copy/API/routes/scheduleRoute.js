import express from 'express';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';
import { CreateShift, updateShift, deleteShift, getShift, getAllShift } from '../controllers/ShiftController.js';


const router = express.Router();


//User Router
router.post('/create',verifyAdmin, CreateShift)
router.put("/:id", verifyAdmin, updateShift) //update
router.delete("/:id", verifyAdmin, deleteShift) //delete
router.get("/:id", verifyUser, getShift) //get
router.get("/", verifyUser, getAllShift) //get all

export default router
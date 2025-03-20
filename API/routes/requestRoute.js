import express from 'express';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';
import { CreateShiftRequest, RejectedRequestShift, getRequestShift, getAllRequest, ApprovedRequestShift } from '../controllers/RequestController.js';


const router = express.Router();


//User Router
router.post('/create-request',verifyUser, CreateShiftRequest)
router.put("/approved-request", verifyAdmin, ApprovedRequestShift) //approved request
router.put("/rejected-request", verifyAdmin, RejectedRequestShift) //delete
router.get("/:id", verifyUser, getRequestShift) //get
router.get("/", verifyAdmin, getAllRequest) //get all

export default router
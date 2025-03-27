import express from 'express';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';
import { CreateShift, updateShift, deleteShift, getShift, getAllShift, getAllSpecificDataShiftForUpdate,getAllUserByDept, getShiftonManageShift } from '../controllers/ShiftController.js';


const router = express.Router();


//User Router
router.post('/create',verifyAdmin, CreateShift)
router.put("/:id", verifyAdmin, updateShift) //update
router.delete("/:id", verifyAdmin, deleteShift) //delete
router.get("/:id", verifyUser, getShift) //get
router.get("/", verifyUser, getAllShift) //get all


router.get("/update/:id/:department", verifyAdmin, getAllSpecificDataShiftForUpdate); //get all specific data for update
router.get("/create/:department", verifyAdmin, getAllUserByDept) //get all by department on create


// router.get("/manage/:id", verifyUser, getShiftonManageShift) //get all the shift created by the user 
router.get("/manage/:department", verifyUser, getShiftonManageShift) //get all the shift created by the user


export default router
import express from "express";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
import {
  CreateShiftRequest,
  RejectedRequestShift,
  getRequestShift,
  getAllRequest,
  ApprovedRequestShift,
} from "../controllers/RequestController.js";
import {
  AcceptSwapRequestShift,
  CreateShiftSwapRequest,
  DeclineSwapRequestShift,
  getReceivedRequestShift,
  getSendRequestShift,
  getAllSwapRequest,
  ApprovedSwapRequestAdmin,
  DeclineSwapAdmin,
  getAllUserByDepartmentReqSwap,
} from "../controllers/ShiftSwapController.js";

const router = express.Router();

//User Router
router.post("/create-request", verifyUser, CreateShiftRequest); // Done
router.put("/approved-request", verifyAdmin, ApprovedRequestShift); //approved request
router.put("/rejected-request", verifyAdmin, RejectedRequestShift); //delete
router.get("/:id", verifyUser, getRequestShift); //getc//done
router.get("/", verifyAdmin, getAllRequest); //get all

//swap Router ---- EMPLOYEE
router.post("/create-request/swap", verifyUser, CreateShiftSwapRequest); //
router.get("/swap-shift/:id", verifyUser, getSendRequestShift); //get
router.get("/swap-shift/to-me/:id", verifyUser, getReceivedRequestShift); //get
router.put("/swap-shift/accept", verifyUser, AcceptSwapRequestShift); //approved request
router.put("/swap-shift/decline", verifyUser, DeclineSwapRequestShift); //decline request

//swap Router ---- Admin
router.get("/swap-shift/all/request", verifyAdmin, getAllSwapRequest); //get all
router.put("/swap-shift/accept/admin", verifyAdmin, ApprovedSwapRequestAdmin); //approved Swap Admin
router.put("/swap-shift/decline/admin", verifyAdmin, DeclineSwapAdmin); //decline request admin

//getUserByDepartment

router.get(
  "/get-user/all/:department",
  verifyUser,
  getAllUserByDepartmentReqSwap
); //get all

export default router;

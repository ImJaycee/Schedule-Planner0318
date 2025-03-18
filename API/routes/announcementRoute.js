import express from "express";
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement, getActiveAnnouncements } from "../controllers/announcementController.js";
import { verifyToken } from "../middleware/middlewareForId.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyAdmin, createAnnouncement);
router.get("/", verifyAdmin, getAnnouncements);
router.get("/active/announcement", verifyUser, getActiveAnnouncements)
router.put("/:id", verifyAdmin, updateAnnouncement);
router.delete("/:id", verifyAdmin, deleteAnnouncement);

export default router;
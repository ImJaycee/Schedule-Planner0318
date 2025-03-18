import express from "express";
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from "../controllers/announcementController.js";
import { verifyToken } from "../middleware/middlewareForId.js";

const router = express.Router();

router.post("/", verifyToken, createAnnouncement);
router.get("/", verifyToken, getAnnouncements);
router.put("/:id", verifyToken, updateAnnouncement);
router.delete("/:id", verifyToken, deleteAnnouncement);

export default router;
import express from "express";
import {
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
  getUsers,
} from "../controllers/userManageController.js";
import { protect, adminOnly } from "../utils/userManageUtils.js";

const router = express.Router();

router.post("/create", protect, adminOnly, createUser);
router.put("/update/:id", protect, adminOnly, updateUser);
router.put("/deactivate/:id", protect, adminOnly, deactivateUser);
router.put("/activate/:id", protect, adminOnly, activateUser);
router.get("/users", protect, adminOnly, getUsers);

export default router;

// filepath: /home/kryptonknight/mer/sched-new/Schedule-Planner-new/API/models/Announcement.js
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // Expiration date
  AdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
});

export default mongoose.model('Announcement', AnnouncementSchema);
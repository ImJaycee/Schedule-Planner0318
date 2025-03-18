import Announcement from '../models/Announcement.js';

// Create an announcement
export const createAnnouncement = async (req, res) => {
  const { title, content, expiresAt } = req.body;
  const AdminId = req.user.id; // Assuming req.user contains the authenticated user's info
  try {
    const newAnnouncement = new Announcement({ title, content, expiresAt, AdminId });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all announcements for the logged-in admin
export const getAnnouncements = async (req, res) => {
  const AdminId = req.user.id; // Assuming req.user contains the authenticated user's info
  try {
    const announcements = await Announcement.find({ AdminId });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an announcement
export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content, expiresAt } = req.body;
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, content, expiresAt },
      { new: true }
    );
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
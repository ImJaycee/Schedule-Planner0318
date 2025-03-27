import express from 'express';

import { GetSpecificUser, UpdateUserDetails, UpdateUserPassword } from '../controllers/ProfileEditController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

router.get('/:id', GetSpecificUser);

// Update user details
router.put('/:id', upload.single('image'), UpdateUserDetails);

// Update user password
router.put('/:id/password', UpdateUserPassword);

export default router;
import express from 'express';

import { GetSpecificUser, UpdateUserDetails, UpdateUserPassword } from '../controllers/ProfileEditController.js';

const router = express.Router();

router.get('/:id', GetSpecificUser);

// Update user details
router.put('/:id', UpdateUserDetails);

// Update user password
router.put('/:id/password', UpdateUserPassword);

export default router;
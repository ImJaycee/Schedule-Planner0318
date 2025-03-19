import express from 'express';
import { Login, LoginAdmin, Register, RegisterAdmin } from '../controllers/AuthController.js';
import { VerifyEmail } from '../utils/verifyEmail.js';
import { VerifyEmailAdmin } from '../utils/verifyEmailAdmin.js';
import { forgetPassword, resetPassword } from '../controllers/ForgetController.js';



const router = express.Router();

router.post('/register', Register)
router.get('/verify', VerifyEmail); 
router.post('/login', Login)

router.post('/admin/register', RegisterAdmin)
router.get('/verifyadmin', VerifyEmailAdmin); 
router.post('/login/admin', LoginAdmin)

router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);



export default router
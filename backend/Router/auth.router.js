import e from 'express';
import { register,login,logout,refreshAccessToken } from '../controller/authentication.controller.js';

const router = e.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout);
router.post('/refresh-token',refreshAccessToken);
export default router;
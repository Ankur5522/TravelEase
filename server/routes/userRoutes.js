import express from 'express';
import { checkUser, loginUser, signupUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/checkUser', checkUser);
router.post('/signup', signupUser);

export default router;

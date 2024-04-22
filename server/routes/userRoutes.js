import express from 'express';
import { checkUser, loginUser, signupUser, fetchUser, settleAmount } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/checkUser', checkUser);
router.post('/signup', signupUser);
router.get('/fetchUser/:userId', fetchUser);
router.post('/settleAmount', settleAmount)

export default router;

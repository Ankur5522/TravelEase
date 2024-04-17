import express from 'express';
import { createMessage, getMessages } from '../controllers/messageControllers.js';

const router = express.Router();

// Create a new message
router.post('/', createMessage);

// Get messages for a specific chat room
router.get('/:groupId', getMessages);

export default router;

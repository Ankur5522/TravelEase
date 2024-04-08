import express from 'express';
import { createGroup, deleteGroup, getGroup, getGroups, updateGroup } from '../controllers/groupControllers.js';

const router = express.Router();

router.get('/getGroups', getGroups);
router.get('/getGroup/:id', getGroup);
router.post('/createGroup', createGroup);
router.post('/updateGroup/:id', updateGroup);
router.delete('/deleteGroup/:id', deleteGroup);

export default router;
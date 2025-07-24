import express from 'express';
import { createUser, deleteUserById, getUserById, getUsers, loginUser, updateUserById } from '../../controllers/users/user.controller';
import { authenticate } from '../../middleware/verifyJwtToken';

const router = express.Router();



router.get('/', getUsers);
router.get('/:id',authenticate, getUserById);
router.post('/', createUser);
router.post('/login', loginUser);
router.patch('/:id', authenticate, updateUserById);
router.delete('/:id',authenticate, deleteUserById);


export default router;
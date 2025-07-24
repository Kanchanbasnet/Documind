import express from 'express';
import { createUser, deleteUserById, getUserById, getUsers, loginUser, updateUserById } from '../../controllers/users/user.controller';

const router = express.Router();



router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/login', loginUser);
router.patch('/:id', updateUserById);
router.delete('/:id', deleteUserById);


export default router;
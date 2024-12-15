import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './controllers/userController';
import STATUS from './utils';

const router = Router();

// User routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/', async (req, res) => {
  return res.status(STATUS.OK).send('✅ OZtest is running ');
});

export default router;

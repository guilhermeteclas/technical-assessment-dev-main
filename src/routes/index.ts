import { Router } from 'express';
import STATUS from '../utils';
import userRoutes from './User.routes';
import regionRoutes from './Region.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/regions', regionRoutes);

router.get('/', async (req, res) => {
  return res.status(STATUS.OK).send('✅ OZtest is running ');
});

export default router;

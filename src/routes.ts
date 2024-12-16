import { Router } from 'express';
import STATUS from './utils';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './controllers/userController';
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getNearbyRegions,
  getRegionsWithinPoint,
} from './controllers/regionController';

const router = Router();

// rotas de usuários
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// rotas de regiões
router.get('/regions', getRegions);
router.get('/regions/:id', getRegionById);
router.post('/regions', createRegion);
router.put('/regions/:id', updateRegion);
router.delete('/regions/:id', deleteRegion);

router.get('/nearby', getNearbyRegions);
router.get('/withinPoint', getRegionsWithinPoint);

router.get('/', async (req, res) => {
  return res.status(STATUS.OK).send('✅ OZtest is running ');
});

export default router;

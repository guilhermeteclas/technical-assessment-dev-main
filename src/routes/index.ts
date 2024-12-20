import { Router } from 'express';
import { STATUS } from '../utils';
import { LoginController } from '../controllers/loginController';
import { jwtAuth, sessionAuth } from '../middlewares/authMiddleware';
import userRouter from './userRoutes';
import regionRouter from './regionRoutes';
import {
  getNearbyRegions,
  getRegionsWithinPoint,
} from '../controllers/regionController';

const router = Router();

router.use('/users', userRouter, () => {});
router.use('/regions', regionRouter, () => {});

router.get('/nearby', getNearbyRegions);
router.get('/withinPoint', getRegionsWithinPoint);

// login
router.post('/login', LoginController.login);
router.post('/logout', LoginController.logout);

// routes to test authorization session/jwt
router.get('/session', sessionAuth, async (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.description = 'Test session authorization (cookie)'
   */

  return res.status(STATUS.OK).send(req.t('running'));
});
router.get('/jwt', jwtAuth, async (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.description = 'Test JWT authorization'
   * #swagger.security = [{"bearerAuth": []}]
   */
  return res.status(STATUS.OK).send(req.t('running'));
});

export default router;

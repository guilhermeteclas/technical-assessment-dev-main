import { Router } from 'express';
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
} from '../controllers/regionController';

const regionRouter = Router();

regionRouter.get('/', getRegions);
regionRouter.get('/:id', getRegionById);
regionRouter.post('/', createRegion);
regionRouter.put('/:id', updateRegion);
regionRouter.delete('/:id', deleteRegion);

export default regionRouter;

import { Router } from 'express';
import STATUS from '../utils';

const router = Router();

router.get('/', async (req, res) => {
    return res.status(STATUS.OK).send();
});

export default router;
import { Router } from 'express';
import { UserModel } from '../models';
import STATUS from '../utils';

const router = Router();

router.get('/', async (req, res) => {
    const { page, limit } = req.query;
  
    const [users, total] = await Promise.all([
      UserModel.find().lean(),
      UserModel.count(),
    ]);
  
    return res.json({
      rows: users,
      page,
      limit,
      total,
    });
  });
  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id }).lean();
  
    if (!user) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'User not found' });
    }
  
    return res.json(user);
  });

  
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { update } = req.body;
  
    const user = await UserModel.findOne({ _id: id });
  
    if (!user) {
      return res.status(STATUS.DEFAULT_ERROR).json({ message: 'User not found' });
    }
  
    user.name = update.name;
 
    await user.save();
  
    return res.sendStatus(201);
  });
  
  export default router;
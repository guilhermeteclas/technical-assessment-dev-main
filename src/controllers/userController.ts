import { Request, Response } from 'express';
import { UserModel } from '../models';
import STATUS from '../utils';
import mongoose from 'mongoose';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const [users, total] = await Promise.all([
      UserModel.find()
        .skip((+page - 1) * +limit)
        .limit(+limit),
      UserModel.countDocuments(),
    ]);

    return res.json({
      rows: users,
      page,
      limit,
      total,
    });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id }).lean();

    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    return res.json(user);
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, address, coordinates } = req.body;

    const newUser = new UserModel({
      name,
      email,
      address,
      coordinates,
    });

    const savedUser = await newUser.save();
    await session.commitTransaction();
    console.log('Commit OK');
    return res.status(STATUS.CREATED).json(savedUser);
  } catch (error) {
    await session.abortTransaction();
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const update = req.body;

    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    user.name = update?.name;
    user.email = update?.email;
    user.address = update?.address;
    user.coordinates = update?.coordinates;

    const updatedUser = await user.save();
    await session.commitTransaction();
    console.log('Commit OK');

    return res.status(STATUS.UPDATED).json(updatedUser);
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    await user.deleteOne();
    await session.commitTransaction();
    console.log('Commit OK');
    return res.status(STATUS.OK).json({ message: req.t('status.OK') });
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  } finally {
    session.endSession();
  }
};

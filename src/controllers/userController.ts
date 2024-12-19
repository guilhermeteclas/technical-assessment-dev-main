import { Request, Response } from 'express';
import { UserModel } from '../models';
import { ENV, STATUS } from '../utils';
import bcrypt from 'bcryptjs';

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
  try {
    const { name, email, password, address, coordinates } = req.body;
    const hashedPassword = await bcrypt.hash(password, ENV.SALT);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      address,
      coordinates,
    });

    const savedUser = await newUser.save();

    return res
      .status(STATUS.CREATED)
      .json({ id: savedUser.id, 'message:': req.t('status.ok') });
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
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
    user.password = update?.password
      ? await bcrypt.hash(update.password, ENV.SALT)
      : user.password;

    const updatedUser = await user.save();

    return res
      .status(STATUS.UPDATED)
      .json({ id: updatedUser.id, 'message:': req.t('status.ok') });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    await user.deleteOne();

    return res.status(STATUS.OK).json({ message: req.t('status.OK') });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

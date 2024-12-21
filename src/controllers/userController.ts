import { Request, Response } from 'express';
import { UserModel } from '../models';
import { ENV, STATUS } from '../utils';
import bcrypt from 'bcryptjs';

interface User {
  name: string;
  email: string;
  password: string;
  address: string;
  coordinates: number[][][];
}

export const getUsers = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Fetch all users'
   */
  try {
    const { page = 1, limit = 10 } = req.query;

    const [users, total] = await Promise.all([
      UserModel.find()
        .skip((+page - 1) * +limit)
        .limit(+limit),
      UserModel.countDocuments(),
    ]);

    return res.status(200).json({
      rows: users,
      page,
      limit,
      total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Find user by id'
   */
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id }).lean();

    if (!user) {
      // #swagger.responses[400] = { description: 'User not founded in database' }
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Create a new user. Address and coordinates may be provided. There will be an error if you provide both or neither.'
   */
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Some description...',
            schema: {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "password": "securepassword123",
                "address": "R. Jerônimo Coelho, 60 - Centro, Florianópolis - SC",
                "coordinates": [-27.5973289, -48.553059956317256]
            }
      } 
  */

  try {
    const { name, email, password, address, coordinates }: User = req.body;
    const hashedPassword =
      password != '' ? await bcrypt.hash(password, ENV.SALT) : '';

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      address,
      coordinates,
    });

    const savedUser = await newUser.save();

    return res
      .status(201)
      .json({ id: savedUser.id, 'message:': req.t('status.ok') });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Update a user. Address and coordinates may be provided. There will be an error if you provide both or neither.'
   */

  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Some description...',
            schema: {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "password": "securepassword123",
                "address": "R. Jerônimo Coelho, 60 - Centro, Florianópolis - SC",
                "coordinates": [-27.5973289, -48.553059956317256]
            }
      } 
  */

  try {
    const { id } = req.params;
    const update = req.body;

    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      // #swagger.responses[400] = { description: 'User not founded in database' }
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
      .status(201)
      .json({ id: updatedUser.id, 'message:': req.t('status.ok') });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Remove a user'
   */
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      // #swagger.responses[400] = { description: 'User not founded in database' }
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    await user.deleteOne();
    // #swagger.responses[200] = { description: 'User deleted' }
    return res.status(STATUS.OK).json({ message: req.t('status.ok') });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

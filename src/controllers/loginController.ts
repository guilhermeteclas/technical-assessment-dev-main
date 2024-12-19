import { Request, Response } from 'express';
import { UserModel } from '../models';
import { STATUS } from '../utils';
import bcrypt from 'bcryptjs';
import { ISession } from '../types/express-session';
import jwt from 'jsonwebtoken';
import { ENV } from '../utils';

export class LoginController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email }).select('password');

    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: req.t('status.unauthorized.password') });
    }

    // sessionAuth
    (req.session as ISession).Id = user.id;

    // jwtAuth
    const token = jwt.sign({ userId: user._id }, ENV.SECRET as string, {
      expiresIn: '1h',
    });

    return res.status(STATUS.OK).json({ message: req.t('status.ok'), token });
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao finalizar sessão' });
      }
      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  }
}

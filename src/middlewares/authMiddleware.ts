import { Request, Response, NextFunction } from 'express';
import { ISession } from '../types/express-session';
import { STATUS, ENV } from '../utils';
import jwt from 'jsonwebtoken';

export function sessionAuth(req: Request, res: Response, next: NextFunction) {
  if ((req.session as ISession).Id) {
    return next();
  } else {
    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ message: req.t('status.unauthorized') });
  }
}

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    jwt.verify(token, ENV.SECRET as string);
    next();
  } catch (err) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ message: req.t('status.unauthorized'), error: err });
  }
}

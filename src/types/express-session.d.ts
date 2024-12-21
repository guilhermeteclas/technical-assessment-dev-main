import { Session } from 'express-session';

export interface ISession extends Session {
  Id?: string;
  Email?: string;
}

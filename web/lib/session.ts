import type { IronSessionOptions } from 'iron-session';
import { User } from '../models/user/user';

export const sessionOptions: IronSessionOptions = {
  cookieName: 'session',
  password: process.env.IRON_ENCRYPTION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
    accessToken?: string;
  }
}

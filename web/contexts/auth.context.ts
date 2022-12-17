import { createContext, Dispatch, SetStateAction } from 'react';
import { AuthService, IAuthService } from '../services/auth.service';

export interface IAuthContext {
  userToken?: string;
  setUserToken?: Dispatch<SetStateAction<string>>;
  authService: IAuthService;
}

export const AuthContext = createContext<IAuthContext>({
  userToken: '',
  setUserToken: () => {},
  authService: new AuthService(),
});

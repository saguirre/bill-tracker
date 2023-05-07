import { User } from '../models/user/user';
import { createContext, Dispatch, SetStateAction } from 'react';
import { Bill } from '../models/bill/bill';
import { KeyedMutator } from 'swr';

export interface IAppContext {
  user: User | undefined;
  mutateUser: KeyedMutator<User>;
  bills: Bill[];
  setBills: Dispatch<SetStateAction<Bill[]>>;
  logout: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  user: undefined,
  mutateUser: () => new Promise(() => {}),
  bills: [],
  setBills: () => {},
  logout: async () => {},
});

import { User } from '../models/user/user';
import { createContext, Dispatch, SetStateAction } from 'react';
import { Bill } from '../models/bill/bill';
import { KeyedMutator } from 'swr';

export interface IGlobalContext {
  user: User | undefined;
  mutateUser: KeyedMutator<User>;
  bills: Bill[];
  setBills: Dispatch<SetStateAction<Bill[]>>;
  logout: () => Promise<void>;
}

export const GlobalContext = createContext<IGlobalContext>({
  user: undefined,
  mutateUser: () => new Promise(() => {}),
  bills: [],
  setBills: () => {},
  logout: async () => {},
});

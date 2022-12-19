import { User } from '../models/user/user';
import { createContext, Dispatch, SetStateAction } from 'react';
import { Bill } from '../models/bill/bill';
import { BillService, IBillService } from '../services/bill.service';

export interface IAppContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  bills: Bill[];
  setBills: Dispatch<SetStateAction<Bill[]>>;
  billService: IBillService;
}

export const AppContext = createContext<IAppContext>({
  user: null,
  setUser: () => {},
  bills: [],
  setBills: () => {},
  billService: new BillService(),
});

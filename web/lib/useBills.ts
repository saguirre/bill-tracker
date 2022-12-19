import useSWR from 'swr';
import { Bill } from '../models/bill/bill';
import { User } from '../models/user/user';

export default function useBills(user: User | undefined) {
  // We do a request to /api/bills only if the user is logged in
  const { data: bills } = useSWR<Bill[]>(user?.isLoggedIn ? `/api/bills/user/${user?.id}` : null);

  return { bills };
}

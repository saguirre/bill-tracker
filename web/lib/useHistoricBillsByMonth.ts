import useSWR from 'swr';
import { Bill } from '../models/bill/bill';
import { HistoricBillsByMonth } from '../models/historic/historic-bills-by-month';
import { User } from '../models/user/user';

export default function useHistoricBillsByMonth(user: User | undefined) {
  // We do a request to /api/historic/months only if the user is logged in
  const { data: historicBillsByMonth, mutate: mutateHistoricBillsByMonth } = useSWR<HistoricBillsByMonth>(
    user?.isLoggedIn ? `/api/historic/user/${user?.id}/months` : null
  );

  return { historicBillsByMonth, mutateHistoricBillsByMonth };
}

import useSWR from 'swr';
import { HistoricBillsByCategory } from '../models/historic/historic-bills-by-category';
import { User } from '../models/user/user';

export default function useHistoricBillsByCategory(user: User | undefined) {
  // We do a request to /api/historic/user/[id]/categories only if the user is logged in
  const { data: historicBillsByCategory, mutate: mutateHistoricBillsByCategory } = useSWR<HistoricBillsByCategory>(
    user?.isLoggedIn ? `/api/historic/user/${user?.id}/categories` : null
  );

  return { historicBillsByCategory, mutateHistoricBillsByCategory };
}

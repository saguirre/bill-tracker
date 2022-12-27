import useSWR from 'swr';
import { CategoryModel } from '../models/category';
import { User } from '../models/user/user';

export default function useCategories(user: User | undefined) {
  // We do a request to /api/categories only if the user is logged in
  const { data: categories, mutate: mutateCategories } = useSWR<CategoryModel[]>(
    user?.isLoggedIn ? `/api/categories/user/${user?.id}` : null
  );

  return { categories, mutateCategories };
}

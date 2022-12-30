import useSWR from 'swr';
import { Group } from '../models/group/group';
import { User } from '../models/user/user';

export default function useGroups(user: User | undefined) {
  // We do a request to /api/groups only if the user is logged in
  const { data: groups, mutate: mutateGroups } = useSWR<Group[]>(user?.isLoggedIn ? `/api/groups` : null);

  return { groups, mutateGroups };
}

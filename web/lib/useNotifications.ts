import useSWR from 'swr';
import { Notification } from '../models/notification/notification';
import { User } from '../models/user/user';

export default function useNotifications(user: User | undefined) {
  // We do a request to /api/notifications only if the user is logged in
  const { data: notifications, mutate: mutateNotifications } = useSWR<Notification[]>(
    user?.isLoggedIn ? `/api/notifications/user/${user?.id}` : null
  );

  return { notifications, mutateNotifications };
}

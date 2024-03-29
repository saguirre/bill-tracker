import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import { User } from '../models/user/user';

export default function useUser({ redirectTo = '', redirectIfFound = false, initialUserData = undefined } = {}) {
  const { data: user, mutate: mutateUser } = useSWR<User>('/api/user', { fallbackData: initialUserData });

  useEffect(() => {
    // if no redirect needed, just return (example: already on /)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}

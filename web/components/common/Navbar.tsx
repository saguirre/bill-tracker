import { BellIcon, EnvelopeOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { ThemeChanger } from '../ThemeChanger';
import * as Ably from 'ably/promises';
import { configureAbly } from '@ably-labs/react-hooks';
import useNotifications from '../../lib/useNotifications';
import { User } from '../../models/user/user';
import logout from '../../pages/api/logout';
import { GlobalContext } from '../../contexts';

interface NavbarProps {
  scrolling: boolean;
  search?: (value: string) => void;
  user?: User;
  showSearch?: boolean;
}
export const Navbar: React.FC<NavbarProps> = ({ showSearch, user, scrolling, search }) => {
  const router = useRouter();
  const notificationLabelRef = useRef<HTMLLabelElement>(null);
  const { logout } = useContext(GlobalContext);
  const commandPlusF = useRef<HTMLInputElement>(null);
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const { notifications, mutateNotifications } = useNotifications(user);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const ably: Ably.Types.RealtimePromise = configureAbly({ authUrl: '/api/authentication' });

    const _channel = ably.channels.get('status-updates');
    _channel.subscribe((message: Ably.Types.Message) => {
      mutateNotifications([message.data, ...(notifications || [])]);
    });
    setChannel(_channel);

    return () => {
      _channel.unsubscribe();
    };
  }, []);

  const markNotificationAsRead = async (id: number) => {
    try {
      await fetchJson(`/api/notifications/${id}`, {
        method: 'PUT',
      });
      mutateNotifications(notifications?.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetchJson(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      mutateNotifications(notifications?.filter((n) => n.id !== id));
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  useKeyPress(() => {
    if (showSearch) commandPlusF?.current?.focus();
  }, ['KeyK']);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
      setIsMac(true);
    }
  }, [router.isReady]);

  return (
    <div
      className={classNames('w-full navbar fixed flex flex-row items-center justify-between bg-base-100 z-20 p-3', {
        'shadow-sm': scrolling,
        'shadow-none': !scrolling,
      })}
    >
      <div className="relative ml-[130px] flex w-full items-start justify-start">
        {showSearch && (
          <>
            <input
              ref={commandPlusF}
              onChange={(e) => {
                if (search) search(e.target.value);
              }}
              className="relative input input-ghost w-full max-w-xs"
              placeholder="Search"
            />
            {isMac ? (
              <kbd className="absolute left-[265px] opacity-60 top-3 kbd kbd-sm">⌘</kbd>
            ) : (
              <span className="absolute left-[245px] opacity-60 top-2.5 kbd kbd-sm px-2 py-0.5">ctrl</span>
            )}
            <kbd className="absolute left-[290px] opacity-60 top-3 kbd kbd-sm">K</kbd>
          </>
        )}
      </div>
      <div className="flex flex-row items-center justify-end">
        <ThemeChanger />
        <div className="dropdown dropdown-end">
          <label ref={notificationLabelRef} tabIndex={0} className="btn btn-ghost btn-circle mr-3">
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
              {notifications && notifications?.filter((notification) => !notification.read)?.length > 0 && (
                <span className="badge badge-md badge-accent text-accent-content indicator-item">
                  {notifications?.filter((notification) => !notification.read)?.length}
                </span>
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className={classNames(
              'border border-base-300 dropdown-content mt-3 shadow overflow-x-hidden py-3 pl-3 pr-0 flex flex-col gap-2 overflow-y-scroll bg-base-100 rounded-box max-h-60',
              {
                'w-[500px]': notifications && notifications?.length > 0,
                'w-[300px]': notifications?.length === 0,
              }
            )}
          >
            {notifications?.length === 0 && (
              <li className="w-full hover:bg-base-200 rounded-box p-4">
                <div className="flex flex-row">
                  <div className="flex flex-col items-center justify-center w-full">
                    <img src="/images/no_notifications.svg" className="h-40 w-40 -mt-5" />
                    <span className="text-sm text-base-content/80">No notifications</span>
                  </div>
                </div>
              </li>
            )}
            {notifications?.map((notification) => (
              <div key={notification.id || notification.title} className="indicator w-full">
                <span
                  className={classNames('indicator-item badge badge-sm badge-primary right-2 top-0.5', {
                    hidden: notification.read,
                  })}
                ></span>
                <li
                  className={classNames('w-full hover:bg-base-200 rounded-box p-4', {
                    'bg-base-200': !notification.read,
                  })}
                >
                  <div className="flex flex-row">
                    <div className="flex flex-col items-start justify-start w-full">
                      <span className="text-base font-bold">{notification.title}</span>
                      <span className="text-xs text-base-content/50 mt-1">{notification.message}</span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          notificationLabelRef?.current?.focus();
                          markNotificationAsRead(notification.id);
                        }}
                        className="btn btn-sm btn-outline btn-primary w-fit"
                      >
                        <EnvelopeOpenIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          notificationLabelRef?.current?.focus();
                          deleteNotification(notification.id);
                        }}
                        className="btn btn-sm btn-outline btn-error w-fit"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {user?.avatar && <img src={user?.avatar} alt="avatar" className="rounded-full h-10 w-10" />}
              {!user?.avatar && (
                <img
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="avatar"
                  className="rounded-full h-10 w-10"
                />
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="border border-base-300 menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <a onClick={() => logout()}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

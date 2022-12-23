import { BellIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { ThemeChanger } from '../ThemeChanger';

interface NavbarProps {
  scrolling: boolean;
  search?: (value: string) => void;
}
export const Navbar: React.FC<NavbarProps> = ({ scrolling, search }) => {
  const router = useRouter();
  const commandPlusF = useRef<HTMLInputElement>(null);
  useKeyPress(() => {
    commandPlusF?.current?.focus();
  }, ['KeyK']);

  return (
    <div
      className={classNames('w-full navbar fixed flex flex-row items-center justify-between bg-base-100 z-20 p-3', {
        'shadow-sm': scrolling,
        'shadow-none': !scrolling,
      })}
    >
      <div className="relative ml-[130px] flex w-full items-start justify-start">
        <input
          ref={commandPlusF}
          onChange={(e) => {
            if (search) search(e.target.value);
          }}
          className="relative input input-ghost w-full max-w-xs"
          placeholder="Search"
        />
        <kbd className="absolute left-[265px] opacity-60 top-3 kbd kbd-sm">⌘</kbd>
        <kbd className="absolute left-[290px] opacity-60 top-3 kbd kbd-sm">K</kbd>
      </div>
      <div className="flex flex-row items-center justify-end">
        <ThemeChanger />
        <label tabIndex={0} className="btn btn-ghost btn-circle mr-3">
          <div className="indicator">
            <BellIcon className="h-6 w-6" />
            <span className="badge badge-md badge-accent text-accent-content indicator-item">8</span>
          </div>
        </label>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" />
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
              <a
                onClick={async () => {
                  try {
                    await fetchJson('/api/logout', {
                      method: 'POST',
                    });
                    router.push('/signin');
                  } catch (error) {
                    toast.error(
                      'There was an error logging you out. If the error persists, please close the browser tab.'
                    );
                    console.error('Error logging out');
                  }
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

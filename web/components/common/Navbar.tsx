import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import fetchJson from '../../lib/fetchJson';
import { ThemeChanger } from '../ThemeChanger';

interface NavbarProps {
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}
export const Navbar: React.FC<NavbarProps> = ({ setCollapsed }) => {
  const router = useRouter();
  return (
    <div className="w-full navbar bg-base-100 border-b border-base-content/10 p-3">
      <div className="flex-none">
        <label
          htmlFor="my-drawer-3"
          onClick={() => setCollapsed((current) => !current)}
          className="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="flex-1 ml-3">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Bill Tracker
        </Link>
      </div>
      <ThemeChanger />
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="https://placeimg.com/80/80/people" />
          </div>
        </label>
        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
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
  );
};

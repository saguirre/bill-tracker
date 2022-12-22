import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import fetchJson from '../../lib/fetchJson';
import { ThemeChanger } from '../ThemeChanger';

export const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-full navbar flex flex-row items-center justify-between bg-transparent p-3">
      <div className="flex-1 items-center justify-center">
        <input className="input input-bordered w-1/2" placeholder="Search" />
      </div>
      <div className="flex flex-row items-center justify-end">
        <ThemeChanger />
        <div className="dropdown">
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
    </div>
  );
};

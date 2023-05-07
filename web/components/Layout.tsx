import {
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  InboxIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { SidebarItem } from './common/SidebarItem';
import { Navbar } from './common/Navbar';
import { useEffect, useState } from 'react';
import { User } from '../models/user/user';
import fetchJson from '../lib/fetchJson';
import { toast } from 'react-toastify';

interface LayoutProps {
  search?: (value: string) => void;
  children: React.ReactNode;
  user?: User;
  showSearch?: boolean;
}
export const Layout: React.FC<LayoutProps> = ({ showSearch, user, children, search }) => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const listener = () => (window.scrollY > 10 ? setScrolling(true) : setScrolling(false));
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar user={user} showSearch={showSearch} search={search} scrolling={scrolling} />
      <div className="transition-all mt-[74px] ml-[70px] duration-200 ease-in-out relative">{children}</div>
    </div>
  );
};

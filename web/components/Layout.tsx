import { BanknotesIcon, ChartPieIcon, InboxIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { SidebarItem } from './common/SidebarItem';
import { Navbar } from './common/Navbar';
import { useEffect, useState } from 'react';
import { User } from '../models/user/user';

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
      <div className="fixed flex transition-all duration-200 w-[70px] bg-base-100 ease-in-out flex-col h-screen z-50 top-0 left-0">
        <ul className="flex flex-col justify-start bg-base-100 px-2 py-1 mt-2">
          <SidebarItem
            icon={BanknotesIcon}
            className="p-0"
            iconClassName="h-8 w-8 text-primary"
            onClick={() => {
              router.push('/');
            }}
          />
        </ul>
        <div className="divider my-0.5 px-3"></div>
        <ul className="flex flex-col justify-start h-full bg-base-100 px-2 py-1">
          <SidebarItem
            iconClassName="h-5 w-5"
            icon={InboxIcon}
            onClick={() => {
              router.push('/');
            }}
          />
          <SidebarItem
            iconClassName="h-5 w-5"
            icon={ChartPieIcon}
            onClick={() => {
              router.push('/historic');
            }}
          />
        </ul>
      </div>
    </div>
  );
};

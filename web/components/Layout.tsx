import { BanknotesIcon, InboxIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { SidebarItem } from './common/SidebarItem';
import { Navbar } from './common/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="transition-all ml-[70px] duration-200 ease-in-out">{children}</div>
      <div className="flex transition-all duration-200 w-[70px] ease-in-out flex-col h-screen absolute z-50 top-0 left-0">
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
        </ul>
      </div>
    </div>
  );
};

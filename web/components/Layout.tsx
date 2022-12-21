import { DocumentPlusIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import fetchJson from '../lib/fetchJson';
import { CollapsedSidebarItem } from './common/CollapsedSidebarItem';
import { Navbar } from './common/Navbar';
import { ThemeChanger } from './ThemeChanger';

interface LayoutProps {
  children: React.ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col">
      <Navbar setCollapsed={setCollapsed} />
      <div
        className={classNames('transition-all duration-200 ease-in-out', {
          'ml-[70px]': collapsed,
          'ml-52': !collapsed,
        })}
      >
        {children}
      </div>
      <div
        className={classNames(
          'flex transition-all duration-200 border-r border-base-content/5 ease-in-out flex-col h-screen absolute top-[74px] z-50 left-0',
          {
            'w-[70px]': collapsed,
            'w-52': !collapsed,
          }
        )}
      >
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="flex flex-col justify-start h-full bg-base-100 p-3">
          <CollapsedSidebarItem collapsed={collapsed} icon={RectangleGroupIcon} label="Dashboard" onClick={() => {}} />
        </ul>
      </div>
    </div>
  );
};

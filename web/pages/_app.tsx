import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { Bill } from '../models/bill/bill';
import { GlobalContext, IGlobalContext } from '../contexts/app.context';
import { SWRConfig } from 'swr';
import fetchJson from '../lib/fetchJson';
import 'react-toastify/dist/ReactToastify.css';
export { reportWebVitals } from 'next-axiom';
import { SidebarItem } from '../components/common/SidebarItem';
import {
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  InboxIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { TransitionLoading } from '../components/common/TransitionLoading';
import useUser from '../lib/useUser';
import App from 'next/app';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../lib/session';

const toastClass = {
  success:
    'm-2 hover:border-2 hover:border-[#07bc0c] bg-base-100 text-base-content w-fit text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-base-300',
  error:
    'm-2 hover:border-2 hover:border-[#e74c3c] bg-base-100 text-base-content w-fit text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-base-300',
  info: 'm-2 hover:border-2 hover:border-[#3498db] bg-base-100 text-base-content w-fit text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-base-300',
  warning:
    'm-2 hover:border-2 hover:border-[#f1c40f] bg-base-100 text-base-content w-fit text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-base-300',
  default:
    'm-2 hover:border-2 hover:border-[#fff] bg-base-100 text-base-content w-fit text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-base-300',
};

const BillTracker = ({ Component, pageProps }: AppProps) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const { user, mutateUser } = useUser({ initialUserData: pageProps.user });
  const router = useRouter();

  const logout = async () => {
    try {
      await fetchJson('/api/logout', {
        method: 'POST',
      });
      mutateUser(undefined, false);
      router.push('/signin');
    } catch (error) {
      toast.error('There was an error logging you out. If the error persists, please close the browser tab.');
      console.error('Error logging out');
    }
  };

  const appContextProps: IGlobalContext = {
    user,
    mutateUser,
    bills,
    setBills,
    logout,
  };

  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <ThemeProvider>
        <GlobalContext.Provider value={appContextProps}>
          <TransitionLoading>
            <Component {...pageProps} />
          </TransitionLoading>
          {user?.isLoggedIn && (
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
              <ul className="flex flex-col justify-between h-full bg-base-100 px-2 py-1">
                <div className="flex flex-col items-start">
                  <SidebarItem
                    popoverText="Inbox"
                    iconClassName="h-5 w-5"
                    icon={InboxIcon}
                    onClick={() => {
                      router.push('/');
                    }}
                  />
                  <SidebarItem
                    popoverText="Groups"
                    iconClassName="h-5 w-5"
                    icon={UserGroupIcon}
                    onClick={() => {
                      router.push('/groups');
                    }}
                  />
                  <SidebarItem
                    iconClassName="h-5 w-5"
                    icon={ChartPieIcon}
                    popoverText="Historic Data"
                    onClick={() => {
                      router.push('/historic');
                    }}
                  />
                </div>
                <div className="flex flex-col items-end">
                  <SidebarItem
                    iconClassName="h-5 w-5"
                    icon={Cog6ToothIcon}
                    popoverText="Settings"
                    onClick={() => {
                      router.push('/settings');
                    }}
                  />
                  <SidebarItem
                    iconClassName="h-5 w-5"
                    popoverText="Logout"
                    icon={ArrowLeftOnRectangleIcon}
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
                  />
                </div>
              </ul>
            </div>
          )}
          <ToastContainer
            position="bottom-left"
            closeButton={false}
            toastClassName={(props) => toastClass[props?.type || 'default']}
            hideProgressBar={true}
          />
        </GlobalContext.Provider>
      </ThemeProvider>
    </SWRConfig>
  );
};

BillTracker.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  if (appContext.ctx.req && appContext.ctx.res) {
    const { user } = await getIronSession(appContext.ctx.req, appContext.ctx.res, sessionOptions);

    return {
      ...appProps,
      user,
    };
  }

  // here as server-side's already given a valid user, client side should handle the case when navigating
  return appProps;
};

export default BillTracker;

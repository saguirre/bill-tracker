import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { Bill } from '../models/bill/bill';
import { User } from '../models/user/user';
import { AppContext } from '../contexts/app.context';
import { SWRConfig } from 'swr';
import fetchJson from '../lib/fetchJson';
import 'react-toastify/dist/ReactToastify.css';

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
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);

  const appContextProps = {
    user,
    setUser,
    bills,
    setBills,
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
        <AppContext.Provider value={appContextProps}>
          <Component {...pageProps} />
          <ToastContainer
            position="top-left"
            closeButton={false}
            toastClassName={(props) => toastClass[props?.type || 'default']}
            hideProgressBar={true}
          />
        </AppContext.Provider>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default BillTracker;

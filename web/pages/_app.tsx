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

const toastClass = {
  success:
    'm-2 hover:border-2 hover:border-[#07bc0c] w-fit bg-white text-black text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-slate-100',
  error:
    'm-2 hover:border-2 hover:border-[#e74c3c] w-fit bg-white text-black text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-slate-100',
  info: 'm-2 hover:border-2 hover:border-[#3498db] w-fit bg-white text-black text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-slate-100',
  warning:
    'm-2 hover:border-2 hover:border-[#f1c40f] w-fit bg-white text-black text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-slate-100',
  default:
    'm-2 hover:border-2 hover:border-[#fff] w-fit bg-white text-black text-left px-4 py-2 rounded-md border-2 border-transparent shadow-lg hover:cursor-pointer active:bg-slate-100',
};

const BillTracker = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [userToken, setUserToken] = useState('');

  const authContextProps = { userToken, setUserToken };

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
            position="bottom-left"
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

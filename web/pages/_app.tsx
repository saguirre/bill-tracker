import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Layout } from '../components/Layout';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Bill } from '../models/bill/bill';
import { User } from '../models/user/user';
import { AppContext } from '../contexts/app.context';
import { BillService } from '../services/bill.service';
import { AuthService } from '../services/auth.service';
import { AuthContext } from '../contexts';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { LoadingTransition } from '../components/common/LoadingTransition';

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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [userToken, setUserToken] = useState('');
  const authService = new AuthService();
  const billService = new BillService();

  const authContextProps = { userToken, setUserToken, authService };

  const appContextProps = {
    user,
    setUser,
    bills,
    setBills,
    billService,
  };

  useEffect(() => {
    const token = getCookie('access-token');
    if (token) {
      setUserToken(token.toString());
      router.push('/');
    }
    router.push('/signin');
  }, []);

  return (
    <ThemeProvider>
      <AuthContext.Provider value={authContextProps}>
        <AppContext.Provider value={appContextProps}>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer
              position="bottom-left"
              closeButton={false}
              toastClassName={(props) => toastClass[props?.type || 'default']}
              hideProgressBar={true}
            />
          </Layout>
          <LoadingTransition />
        </AppContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default BillTracker;

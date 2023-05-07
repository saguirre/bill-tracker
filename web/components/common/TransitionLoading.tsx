import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LoadingWrapper } from './LoadingWrapper';

interface TransitionLoadingProps {
  children: React.ReactNode;
}
export const TransitionLoading: React.FC<TransitionLoadingProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    router.events.on('routeChangeStart', routeChangeStart);
    router.events.on('routeChangeComplete', routeChangeEnd);
    router.events.on('routeChangeError', routeChangeError);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeEnd);
      router.events.off('routeChangeError', routeChangeError);
    };
  }, []);

  const routeChangeStart = () => {
    setLoading(true);
  };
  const routeChangeEnd = () => {
    setLoading(false);
  };

  const routeChangeError = () => {
    setLoading(false);
  };

  return <LoadingWrapper loading={loading}>{children}</LoadingWrapper>;
};

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../contexts/auth.context';
import { LoadingWrapper } from './LoadingWrapper';
import { getCookie } from 'cookies-next';

export const authenticatedRoute = (Component: React.FC<any>) => {
  return (props: any) => {
    const router = useRouter();
    const [loadingAuth, setLoadingAuth] = useState(true);
    const { authService, setUserToken } = useContext(AuthContext);

    const checkAuth = async () => {
      setLoadingAuth(true);
      const token = getCookie('access-token');
      if (!token) {
        router.push({
          pathname: '/signin',
        });
        return;
      }

      const validToken = await authService.validateUserToken();
      if (!validToken) {
        router.push({
          pathname: '/signin',
        });
      }

      setLoadingAuth(false);
      if (setUserToken) setUserToken(token.toString());
    };

    useEffect(() => {
      checkAuth();
    }, []);

    return (
      <LoadingWrapper loading={loadingAuth}>
        <Component {...props}></Component>
      </LoadingWrapper>
    );
  };
};

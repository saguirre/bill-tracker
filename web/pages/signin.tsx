import { AuthContext } from '../contexts/auth.context';
import { SignInForm } from '../components/signin/SignInForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { AppContext } from '../contexts/app.context';
import { setCookie } from 'cookies-next';

const SignInPage: NextPage = () => {
  const router = useRouter();
  const [loadingRequest, setLoadingRequest] = useState(false);
  const { setUserToken, authService } = useContext(AuthContext);
  const { setUser } = useContext(AppContext);

  const onSubmit = async (data: any) => {
    setLoadingRequest(true);
    const userResponse = await authService.login(data);
    if (userResponse) {
      toast.success('Ingreso exitoso!');
      const { token, ...user } = userResponse;
      setCookie('access-token', token);
      setUser(user);
      router.push({ pathname: '/' });
    }
    setLoadingRequest(false);
  };

  return (
    <div>
      <SignInForm loadingRequest={loadingRequest} submit={onSubmit} />
    </div>
  );
};

export default SignInPage;

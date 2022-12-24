import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import fetchJson, { FetchError } from '../lib/fetchJson';
import { useRouter } from 'next/router';
import { SignUpForm } from '../components/signup/SignUpForm';
import useUser from '../lib/useUser';

export default function SignUp() {
  const router = useRouter();
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  });
  const [loadingRequest, setLoadingRequest] = useState(false);

  const onSubmit = async (data: any) => {
    setLoadingRequest(true);
    try {
      const { name, email, password } = data;
      mutateUser(
        await fetchJson('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }),
        false
      );
      router.push('/signin');
      toast.success('Account created successfully!');
    } catch (error) {
      if (error instanceof FetchError) {
        toast.error(error.data.message);
      } else {
        toast.error('An unexpected error happened');
        console.error('An unexpected error happened:', error);
      }
    }
    setLoadingRequest(false);
  };

  return <SignUpForm loadingRequest={loadingRequest} submit={onSubmit} />;
}

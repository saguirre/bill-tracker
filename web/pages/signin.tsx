import { SignInForm } from '../components/signin/SignInForm';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import useUser from '../lib/useUser';
import fetchJson, { FetchError } from '../lib/fetchJson';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const { mutateUser } = useUser();
  const [loadingRequest, setLoadingRequest] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoadingRequest(true);
      mutateUser(
        await fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
        false
      );
      router.push('/');
      toast.success('Signed in successfully!');
    } catch (error) {
      if (error instanceof FetchError) {
        toast.error(error.data.message);
      } else {
        toast.error('An unexpected error happened');
        console.error('An unexpected error happened:', error);
      }
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <div>
      <SignInForm loading={loadingRequest} submit={onSubmit} />
    </div>
  );
}

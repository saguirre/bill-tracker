import { SignInForm } from '../components/signin/SignInForm';
import { useContext, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import fetchJson, { FetchError } from '../lib/fetchJson';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts';

export default function SignIn() {
  const router = useRouter();
  const { mutateUser } = useContext(GlobalContext);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoadingRequest(true);
      mutateUser(
        await fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
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

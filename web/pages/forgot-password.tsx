import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import fetchJson, { FetchError } from '../lib/fetchJson';
import { ForgotPasswordForm } from '../components/forgot-password/ForgotPasswordForm';

export default function ForgotPassword() {
  const [loadingRequest, setLoadingRequest] = useState(false);

  const onSubmit = async (data: any) => {
    setLoadingRequest(true);
    try {
      await fetchJson('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      toast.success('Recover password email sent!');
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

  return (
    <div>
      <ForgotPasswordForm loadingRequest={loadingRequest} submit={onSubmit} />
    </div>
  );
}

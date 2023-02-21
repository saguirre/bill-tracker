import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import fetchJson, { FetchError } from '../lib/fetchJson';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormInput } from '../components/common/FormInput';
import { useDecorativeImage } from '../hooks/useDecorativeImage.hook';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

interface FormValues {
  password: string;
  repeatPassword: string;
}

export default function RecoverPassword({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });

  const router = useRouter();
  const [loadingRequest, setLoadingRequest] = useState(false);
  const { imagePath } = useDecorativeImage('reset_password');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const getPasswordSuccessPercentage = (password: string) => {
    let percentage = 0;
    if (password.length >= 6) {
      percentage += 25;
    }
    if (password.match(/[a-z]/)) {
      percentage += 25;
    }
    if (password.match(/[A-Z]/)) {
      percentage += 25;
    }
    if (password.match(/[0-9]/)) {
      percentage += 25;
    }
    return percentage;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setLoadingRequest(true);
    try {
      await fetchJson('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password, token }),
      });
      toast.success('Your password was reset!');
      router.push('/signin');
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
    <div className="flex h-screen bg-base-100">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-2 flex-shrink-0">
              <LockClosedIcon className="h-12 w-12 text-primary" />
              <span className="font-bold text-3xl">Reset Password</span>
            </div>
            <div className="mt-2 text-sm">Enter your new password.</div>
          </div>
          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <FormInput
                    id="password"
                    htmlFor="password"
                    type="password"
                    labelText="Password"
                    placeholder="Password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password should be at least 6 characters long',
                      },
                      validate: (value) => {
                        if (!value.match(/[a-z]/)) {
                          return 'Password should contain at least one lowercase letter';
                        } else if (!value.match(/[A-Z]/)) {
                          return 'Password should contain at least one uppercase letter';
                        } else if (!value.match(/[0-9]/)) {
                          return 'Password should contain at least one number';
                        }
                        return true;
                      },
                      maxLength: { value: 50, message: 'Password should not exceed 50 characters' },
                      onChange: (e) => {
                        setPasswordStrength(getPasswordSuccessPercentage(watch('password')));
                      },
                    })}
                    autoComplete="current-password"
                  />
                  <div className="w-full mt-3 flex flex-col items-center justify-center">
                    <progress
                      className={classNames('progress w-56', {
                        'progress-error': passwordStrength <= 25,
                        'progress-warning': passwordStrength > 25 && passwordStrength < 100,
                        'progress-success': passwordStrength === 100,
                      })}
                      value={passwordStrength}
                      max="100"
                    ></progress>
                    <div className="w-full flex items-center justify-center">
                      {passwordStrength <= 25 && (
                        <>
                          {errors.password && (
                            <span className="text-sm text-center text-error mt-1">{errors.password.message}</span>
                          )}
                        </>
                      )}
                      {passwordStrength > 25 && passwordStrength < 100 && (
                        <>
                          {errors.password && (
                            <span className="text-sm text-center text-warning mt-1">{errors.password.message}</span>
                          )}
                        </>
                      )}
                      {passwordStrength === 100 && (
                        <span className="text-sm text-center text-success mt-1">Password is strong</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <FormInput
                    htmlFor="repeatPassword"
                    type="password"
                    labelText="Repeat Password"
                    id="repeatPassword"
                    errors={errors}
                    placeholder="Repeat Password"
                    {...register('repeatPassword', {
                      required: 'You must confirm your password',
                      validate: (value) => value === watch('password'),
                    })}
                    autoComplete="current-password"
                  />
                  {errors.repeatPassword && errors.repeatPassword.type === 'validate' && (
                    <span className="text-sm text-rose-500 mt-1">Passwords don't match</span>
                  )}
                </div>

                <div className="mt-6">
                  <button onClick={handleSubmit(onSubmit)} className="btn btn-primary rounded-xl w-full">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 -ml-20">
        <img className="absolute inset-0 h-full w-full object-cover" src={imagePath} alt="Recover Password" />
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { token } = query;
  return {
    props: {
      token,
    },
  };
}

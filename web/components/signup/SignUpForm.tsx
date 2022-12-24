import { useForm, SubmitHandler } from 'react-hook-form';
import { FormInput } from '../common/FormInput';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { emailRegex } from '../../utils/email-regex.util';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useState } from 'react';

interface FormValues {
  name: string;
  familyName: string;
  email: string;
  password: string;
  repeatPassword: string;
}

interface SignUpFormProps {
  submit: (data: FormValues) => void;
  loadingRequest: boolean;
  isInvitation?: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ submit, loadingRequest }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

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

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    submit(data);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center justify-start gap-2 flex-shrink-0">
              <BanknotesIcon className="h-12 w-12 text-primary" />
              <span className="font-bold text-3xl">Bill Tracker</span>
            </div>
            <div>
              <h2 className="mt-3 text-3xl font-bold text-black">Create a new account</h2>
              <div className="flex flex-row items-center gap-1 mt-1 text-sm text-gray-600">
                Or{' '}
                <Link href="/signin">
                  <div className="font-medium text-primary hover:text-primary/80 hover:cursor-pointer">sign in.</div>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  id="name"
                  type="name"
                  labelText="Name"
                  htmlFor="name"
                  errors={errors}
                  placeholder="Steve Jobs"
                  {...register('name', {
                    required: 'Name is required',
                    maxLength: {
                      value: 50,
                      message: 'Name should not exceed 50 characters',
                    },
                  })}
                  autoComplete="name"
                />
                <FormInput
                  id="email"
                  type="email"
                  labelText="Email"
                  htmlFor="email"
                  errors={errors}
                  placeholder="steve.jobs@microsoft.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: emailRegex,
                      message: 'Email is not valid',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Email should not exceed 50 characters',
                    },
                  })}
                  autoComplete="email"
                />
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
                    <div className='w-full flex items-center justify-center'>
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

                <div className="w-full">
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
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={Object.entries(errors)?.length > 0}
                  className="btn btn-primary rounded-xl w-full"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-cover" src="/images/signup_background.jpg" alt="" />
      </div>
    </div>
  );
};

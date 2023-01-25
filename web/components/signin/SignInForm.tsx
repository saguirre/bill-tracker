import { useForm, SubmitHandler } from 'react-hook-form';
import { FormInput } from '../../components/common/FormInput';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { emailRegex } from '../../utils/regex-utils';
import Link from 'next/link';
import { useDecorativeImage } from '../../hooks/useDecorativeImage.hook';

interface FormValues {
  email: string;
  password: string;
}

interface SignInFormProps {
  submit: (data: FormValues) => void;
  loadingRequest: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({ submit, loadingRequest }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const { imagePath } = useDecorativeImage('sign_in');
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    submit(data);
  };

  return (
    <div className="flex h-screen bg-base-100">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-2 flex-shrink-0">
              <BanknotesIcon className="h-12 w-12 text-primary" />
              <span className="font-bold text-3xl">Bill Tracker</span>
            </div>
            <div>
              <h2 className="mt-3 text-3xl font-bold">Sign in with your account</h2>
              <div className="flex flex-row items-center gap-1 mt-2 text-sm">
                Or{' '}
                <Link href="/signup">
                  <div className="font-medium text-primary hover:text-primary/80 hover:cursor-pointer">
                    create a new one.
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="mt-1">
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
                          message: 'The email is not valid',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Email is too long',
                        },
                      })}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-6">
                  <div className="mt-1">
                    <FormInput
                      id="password"
                      htmlFor="password"
                      type="password"
                      labelText="Password"
                      errors={errors}
                      placeholder="Password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters long.',
                        },
                        maxLength: { value: 50, message: 'Password is too long.' },
                      })}
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Link href="/forgot-password" className="flex flex-col items-end mt-2 w-full">
                  <div className="text-primary text-sm hover:text-primary/80 cursor-pointer">Forgot your password?</div>
                </Link>
                <div className="mt-6">
                  <button onClick={handleSubmit(onSubmit)} className="btn btn-primary rounded-xl w-full">
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-cover" src={imagePath} alt="Sign In" />
      </div>
    </div>
  );
};

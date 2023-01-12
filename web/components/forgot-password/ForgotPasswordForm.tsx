import { useForm, SubmitHandler } from 'react-hook-form';
import { FormInput } from '../common/FormInput';
import { BanknotesIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { emailRegex } from '../../utils/email-regex.util';
import { useDecorativeImage } from '../../hooks/useDecorativeImage.hook';

interface FormValues {
  email: string;
}

interface ForgotPasswordFormProps {
  submit: (data: FormValues) => void;
  loadingRequest: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ submit, loadingRequest }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const { imagePath } = useDecorativeImage('forgot_password');
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    submit(data);
  };

  return (
    <div className="flex h-screen bg-base-100">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-2 flex-shrink-0">
              <LockClosedIcon className="h-12 w-12 text-primary" />
              <span className="font-bold text-3xl">Forgot Password</span>
            </div>
            <div className="mt-2 text-sm">Enter your account email to recover your password.</div>
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

                <div className="mt-6">
                  <button onClick={handleSubmit(onSubmit)} className="btn btn-primary rounded-xl w-full">
                    Recover Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-cover" src={imagePath} alt="Recover Password" />
      </div>
    </div>
  );
};

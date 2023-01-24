import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { usePasswordStrength } from '../../hooks/usePasswordStrength.hook';
import fetchJson from '../../lib/fetchJson';
import { FormInput } from './FormInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { ClipboardDocumentIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import { Spinner } from './Spinner';

interface FormValues {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}
interface ChangePasswordModalProps {}
export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
  });
  const closeRef = useRef<HTMLInputElement>(null);
  const loading = false;

  useKeyPress(
    () => {
      if (closeRef.current) {
        closeRef.current.checked = false;
      }
    },
    ['Escape'],
    false
  );

  const { passwordStrength, updatePasswordStrength } = usePasswordStrength();

  const onSubmit = async (data: FormValues) => {
    try {
      const updatedUser = await fetchJson('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (updatedUser) {
        reset();
        updatePasswordStrength('');
      }
      if (closeRef.current) {
        closeRef.current.checked = false;
      }
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="change-password-modal" className="modal-toggle" />
      <label htmlFor="change-password-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <LockOpenIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">Change Password</h1>
            </div>
            <span className="text-base-content text-sm font-normal">
              Fill out the required fields to change your password.
            </span>
          </div>
          <div className="divider my-1.5"></div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
            <div className="max-w-md flex flex-col gap-1">
              <FormInput
                id="oldPassword"
                htmlFor="oldPassword"
                type="password"
                className="input input-bordered"
                labelText="Old Password"
                placeholder="Old Password"
                {...register('oldPassword', {
                  required: 'Current password is required',
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
                })}
                autoComplete="current-password"
              />
            </div>
            <div className="max-w-md flex flex-col gap-1 mt-3">
              <FormInput
                id="newPassword"
                htmlFor="newPassword"
                type="password"
                labelText="New Password"
                placeholder="New Password"
                {...register('newPassword', {
                  required: 'New password is required',
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
                    updatePasswordStrength(watch('newPassword'));
                  },
                })}
                autoComplete="current-password"
              />
              <PasswordStrengthIndicator passwordStrength={passwordStrength} errors={errors} />
            </div>
            <div className="max-w-md flex flex-col mt-3">
              <FormInput
                htmlFor="repeatNewPassword"
                type="password"
                labelText="Repeat Password"
                id="repeatNewPassword"
                errors={errors}
                placeholder="Repeat New Password"
                {...register('repeatNewPassword', {
                  required: 'You must confirm your new password',
                  validate: (value) => value === watch('newPassword'),
                })}
                autoComplete="current-password"
              />
              {errors.repeatNewPassword && errors.repeatNewPassword.type === 'validate' && (
                <span className="text-sm text-rose-500 mt-1">Passwords don't match</span>
              )}
            </div>
            <div className="flex flex-row items-center justify-end gap-2 mt-5">
              <label htmlFor="change-password-modal" className="btn btn-ghost rounded-xl">
                Cancel
              </label>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={Object.entries(errors)?.length > 0}
                className="btn btn-primary rounded-xl"
              >
                {loading && <Spinner className=" h-4 w-4 border-b-2 border-white bg-primary mr-3"></Spinner>}
                Save
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};

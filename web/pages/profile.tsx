import { TrashIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ChangePasswordModal } from '../components/common/ChangePasswordModal';
import { ClipLoadingIndicator } from '../components/common/ClipLoadingIndicator';
import { UploadAvatarModal } from '../components/common/UploadAvatarModal';
import { Layout } from '../components/Layout';
import { useDecorativeImage } from '../hooks/useDecorativeImage.hook';
import fetchJson from '../lib/fetchJson';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';
import { usPhoneRegex } from '../utils/regex-utils';

interface FormValues {
  name: string;
  phone: string;
  password: string;
  newPassword: string;
  repeatPassword: string;
}
export default function Profile({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { imagePath } = useDecorativeImage('profile');
  const [uploadedAvatar, setUploadedAvatar] = useState<boolean>(false);
  const [changePasswordSelected, setChangePasswordSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const updatedUser = await fetchJson('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (updatedUser) {
        reset(data);
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('There was an error updating the user');
      toast.error('There was an error updating your information');
    } finally {
      setLoading(false);
    }
  };

  const displayPhoneDigit = (digit?: string) => {
    if (digit) {
      return digit;
    }
    return '_';
  };

  const removePhoneFormatting = (phone: string) => {
    return ('' + phone).replace(/[+]1|\(*\)*_*-*\s*/g, '');
  };

  const formatPhoneNumberOnChange = (phoneNumberString: string) => {
    const cleaned = removePhoneFormatting(phoneNumberString);
    return `+1 (${displayPhoneDigit(cleaned?.[0])}${displayPhoneDigit(cleaned?.[1])}${displayPhoneDigit(
      cleaned?.[2]
    )}) ${displayPhoneDigit(cleaned?.[3])}${displayPhoneDigit(cleaned?.[4])}${displayPhoneDigit(
      cleaned?.[5]
    )}-${displayPhoneDigit(cleaned?.[6])}${displayPhoneDigit(cleaned?.[7])}${displayPhoneDigit(
      cleaned?.[8]
    )}${displayPhoneDigit(cleaned?.[9])}`;
  };

  return (
    <Layout user={user}>
      <div className="flex flex-col items-center h-screen px-12 pt-6">
        <div className="h-[600px] w-full bg-base-100 px-6">
          <div className="h-full flex flex-row relative">
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-start justify-start">
                <h2 className="card-title text-xl">
                  Profile
                  <div className="badge">NEW</div>
                </h2>
                <p className="text-sm">Review your personal information</p>
              </div>
              <div className="divider my-1"></div>
              <div className="flex flex-col mt-2 gap-6">
                <div className="flex flex-col gap-3">
                  <span className="text-base font-semibold">Profile Photo</span>
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-col gap-2">
                      {user?.avatar && <img src={user?.avatar} alt="avatar" className="rounded-full h-20 w-20" />}
                      {!user?.avatar && (
                        <img
                          src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                          alt="avatar"
                          className="rounded-full h-20 w-20"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-2 h-full ml-4">
                      <label className="btn btn-primary btn-sm" htmlFor="upload-avatar-modal">
                        Change Photo
                      </label>
                      <label className="btn btn-error btn-sm btn-disabled flex flex-row items-center justify-start gap-2">
                        <TrashIcon className="h-5 w-5" /> Remove Photo
                      </label>
                    </div>
                  </div>
                  <span className="text-xs">The recommended photo size is 256x256px.</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Name</span>
                    <div className="flex flex-row gap-3 items-center w-full">
                      <input
                        className="input input-bordered border-base-content w-full max-w-md"
                        {...register('name', {
                          required: 'Name is required',
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Email</span>
                    <div className="flex flex-row gap-3 items-center w-full">
                      <input className="input input-bordered w-full max-w-md" disabled value={user?.email} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div>
                      <span className="text-base font-semibold">Password</span>
                      <div className="flex flex-row gap-3 items-center w-full">
                        <input className="input input-bordered w-full max-w-md" disabled value="********" />
                        <label htmlFor="change-password-modal" className="btn btn-outline btn-secondary">
                          Modify
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Phone</span>
                    <div className="flex flex-row gap-3 items-center w-full">
                      <input
                        maxLength={18}
                        className="input input-bordered border-base-content w-full max-w-md"
                        {...register('phone', {
                          pattern: {
                            value: usPhoneRegex,
                            message: 'The Phone is not valid',
                          },
                          onChange: (e) => {
                            const { value } = e.target;
                            const formattedValue = formatPhoneNumberOnChange(value);
                            e.target.value = formattedValue;
                          },
                        })}
                        placeholder="+1 (999) 999-9999"
                      />
                    </div>
                  </div>
                  {isDirty && Object.entries(errors).length === 0 && (
                    <div className="toast toast-bottom toast-center w-[80%] mb-10 z-10">
                      <div className="alert shadow-lg bg-base-100 border border-primary">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-info flex-shrink-0 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span>
                            Your Profile Info has been updated. If you wish to keep these changes, please press Save.
                          </span>
                        </div>
                        <div className="flex-none">
                          <button onClick={() => reset()} type="button" className="btn btn-sm btn-ghost">
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-sm btn-primary">
                            {loading && <ClipLoadingIndicator size={20} loading={loading} />}
                            {!loading && 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <img src={imagePath} alt="Profile" className="hidden xl:block absolute h-[90%] right-0 top-20" />
          </div>
        </div>
        <div className="pb-10"></div>
      </div>
      {uploadedAvatar && (
        <div className="toast toast-bottom toast-center w-[80%] mb-10">
          <div className="alert shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Your Profile Photo has been updated. Please refresh to see the changes.</span>
            </div>
            <div className="flex-none">
              <button onClick={() => router.reload()} className="btn btn-sm btn-primary">
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
      <UploadAvatarModal
        userId={user?.id}
        uploadedAvatar={() => {
          setUploadedAvatar(true);
        }}
      />
      <ChangePasswordModal />
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const user = req.session.user;

  if (!user || !user?.isLoggedIn) {
    res.writeHead(301, { Location: '/signin' });
    res.end();
    return {
      props: {
        user: { isLoggedIn: false } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
}, sessionOptions);

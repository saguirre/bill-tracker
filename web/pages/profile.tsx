import { TrashIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { UploadAvatarModal } from '../components/common/UploadAvatarModal';
import { Layout } from '../components/Layout';
import { useDecorativeImage } from '../hooks/useDecorativeImage.hook';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';
import { getCorrespondingThemeImage } from '../utils/get-page-image-by-theme';

export default function Profile({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { imagePath } = useDecorativeImage('profile');
  const [uploadedAvatar, setUploadedAvatar] = useState<boolean>(false);
  return (
    <Layout user={user}>
      <div className="flex flex-col items-center h-full px-12 pt-6">
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
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Name</span>
                    <input className="input input-bordered w-full max-w-md" value={user?.name} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Email</span>
                    <div className="flex flex-row gap-3 items-center w-full">
                      <input className="input input-bordered w-full max-w-md" disabled value={user?.email} />
                      <label className="btn btn-outline btn-secondary">Modify</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Phone</span>
                    <input className="input input-bordered w-full max-w-md" placeholder="+1 (999) 999-9999"value={user?.phone} />
                  </div>
                </div>
              </div>
            </div>
            <img
              src={imagePath}
              alt="Profile"
              className="hidden xl:block absolute h-[90%] right-0 top-20"
            />
          </div>
        </div>
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

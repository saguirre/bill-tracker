import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next';
import { Layout } from '../components/Layout';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';

export default function Settings({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="flex flex-col items-center h-full p-8">
        <div className="card h-[600px] w-full bg-base-100 shadow-xl">
          <div className="card-body h-full flex flex-row relative">
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-start justify-start">
                <h2 className="card-title">Settings</h2>
                <p className="text-sm">Review your settings</p>
              </div>
              <div className="divider my-1"></div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <span className="text-base font-semibold">Profile Photo</span>
                  <div className="flex flex-row items-center">
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
                      <label className="btn btn-primary btn-sm">Change Photo</label>
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
                    <input className="input input-bordered w-full max-w-xs" value={user?.name} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Email</span>
                    <div className="flex flex-row gap-3 items-center w-full">
                      <input className="input input-bordered w-full max-w-xs" disabled value={user?.email} />
                      <label className="btn btn-outline btn-secondary">Modify</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Phone</span>
                    <input className="input input-bordered w-full max-w-xs" value={user?.phone} />
                  </div>
                </div>
              </div>
            </div>
            <img src="/images/settings.svg" alt="profile" className="hidden xl:block absolute h-[90%] right-0 top-20" />
          </div>
        </div>
      </div>
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

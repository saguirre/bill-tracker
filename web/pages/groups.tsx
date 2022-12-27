import type { InferGetServerSidePropsType } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';
import { Layout } from '../components/Layout';

export default function Groups({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout showSearch={true} user={user}>
      <div className="flex flex-col items-center h-full px-12">
        <div className="h-full w-full bg-base-100 px-6">
          <div className="h-full flex flex-row relative">
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-start justify-start">
                <h2 className="card-title">
                  Groups
                  <div className="badge">COMING SOON</div>
                </h2>
                <p className="text-sm">Review your groups</p>
              </div>
              <div className="divider my-1"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full w-full mb-20">
          <img src="/images/under_construction.svg" alt="Coming Soon" className="w-[500px]" />
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

import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Layout } from '../../../../components/Layout';
import { sessionOptions } from '../../../../lib/session';
import { User } from '../../../../models/user/user';

export default function GroupInvite({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { theme } = useTheme();

  return (
    <>
      {user?.isLoggedIn ? (
        <Layout>
          <div></div>
        </Layout>
      ) : (
        <div></div>
      )}
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const user = req.session.user;

  if (!user || !user?.isLoggedIn) {
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

import { TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import jwtDecode from 'jwt-decode';
import { InferGetServerSidePropsType } from 'next';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';
import { sessionOptions } from '../../../lib/session';
import { User } from '../../../models/user/user';
import { getCorrespondingThemeImage } from '../../../utils/get-page-image-by-theme';

export default function JoinGroup({ user, groupId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <Layout user={user}>
      <div className="flex flex-col items-center h-full px-12 pt-6">
        <div className="h-[600px] w-full bg-base-100 px-6">
          <div className="h-full flex flex-row items-center justify-center">
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold -mb-16 alert bg-base-100">
                <div className="flex flex-row items-center justify-center gap-2 w-full">
                  <UserGroupIcon className="w-10" /> Group Joined!
                </div>
              </h1>
              <img src={getCorrespondingThemeImage('joined_group', theme)} alt="Profile" className="h-96" />
              <button className="btn btn-secondary btn-md -mt-8" onClick={() => router.push({ pathname: '/groups' })}>
                View My Groups
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res, query }) {
  const user = req.session.user;
  if (!user || !user?.isLoggedIn) {
    res.writeHead(301, { Location: '/signin' });
    res.end();
    return {
      props: {
        user: { isLoggedIn: false } as User,
        groupId: undefined,
      },
    };
  }

  const { token } = query;
  if (token) {
    const decodedToken: any = jwtDecode(token as string);
    if (decodedToken && decodedToken.groupId && decodedToken.email) {
      const body = JSON.stringify({
        email: decodedToken.email,
      });
      // Accept invitation
      try {
        await fetchJson(getServiceUrl(`group/${decodedToken.groupId}/members`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body,
        });
      } catch (error) {
        console.error(error);
      }

      return {
        props: { user: req.session.user, groupId: decodedToken.groupId },
      };
    }
  }

  return {
    props: { user: req.session.user, groupId: undefined },
  };
}, sessionOptions);

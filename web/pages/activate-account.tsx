import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import jwtDecode from 'jwt-decode';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useDecorativeImage } from '../hooks/useDecorativeImage.hook';
import fetchJson from '../lib/fetchJson';
import { getServiceUrl } from '../lib/httpHelpers';

export default function JoinGroup() {
  const router = useRouter();
  const { imagePath } = useDecorativeImage('account_activated');

  return (
    <div className="flex flex-col items-center h-full px-12 pt-6">
      <div className="h-[600px] w-full bg-base-100 px-6">
        <div className="h-full flex flex-row items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold -mb-14 alert -ml-10 bg-base-100">
              <div className="flex flex-row items-center justify-center gap-2 w-full">
                <CheckBadgeIcon className="w-10" /> Account Activated!
              </div>
            </h1>
            <img src={imagePath} alt="Account activated" className="h-96" />
            <button className="btn btn-secondary btn-md -mt-8" onClick={() => router.push({ pathname: '/signin' })}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { token } = query;
  if (token) {
    const decodedToken: any = jwtDecode(token as string);
    if (decodedToken && decodedToken.userId) {
      const body = JSON.stringify({
        token,
      });
      // Activate account
      try {
        await fetchJson(getServiceUrl(`user/activate/${decodedToken.userId}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        return {
          props: {},
        };
      } catch (error) {
        // Should probably return an error state and display that error in the page
        console.error(error);
      }
      return {
        props: {},
      };
    }
  }
}

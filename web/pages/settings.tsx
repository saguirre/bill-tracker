import { TrashIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';
import { getCorrespondingThemeImage } from '../utils/get-page-image-by-theme';

export default function Settings({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [inAppNotifications, setInAppNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(true);
  const [usageStatistics, setUsageStatistics] = useState<boolean>(true);
  return (
    <Layout user={user}>
      <div className="flex flex-col items-center h-full px-12 pt-6">
        <div className="h-[600px] w-full bg-base-100 px-6">
          <div className="h-full flex flex-row relative">
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-start justify-start">
                <h2 className="card-title text-xl">Settings</h2>
                <p className="text-sm">Review your settings</p>
              </div>
              <div className="divider my-1"></div>
              <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-col gap-3 justify-between h-full">
                  <div className="flex flex-col gap-3 mt-3 w-full max-w-sm">
                    <div className="flex flex-col gap-3 w-full max-w-sm">
                      <span className="text-lg font-semibold">Notifications</span>
                      <div className="divider -mt-3 -mb-1 w-full"></div>
                      <div className="text-base font-semibold flex flex-row items-center justify-between gap-3">
                        <span>Receive notifications</span>
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="toggle toggle-primary max-w-xs"
                        />
                      </div>
                      <div className="text-base font-semibold flex flex-row items-center justify-between gap-3">
                        <span>Receive In-app notifications</span>
                        <input
                          type="checkbox"
                          disabled={!notifications}
                          checked={notifications && inAppNotifications}
                          onChange={(e) => setInAppNotifications(e.target.checked)}
                          className="toggle toggle-primary max-w-xs"
                        />
                      </div>
                      <div className="text-base font-semibold flex flex-row items-center justify-between gap-3">
                        <span>Receive Email notifications</span>
                        <input
                          type="checkbox"
                          disabled={!notifications}
                          checked={notifications && emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="toggle toggle-primary max-w-xs"
                        />
                      </div>
                      <div className="text-base font-semibold flex flex-row items-center justify-between gap-3">
                        <span>Receive SMS notifications</span>
                        <input
                          type="checkbox"
                          disabled={!notifications}
                          checked={notifications && smsNotifications}
                          onChange={(e) => setSmsNotifications(e.target.checked)}
                          className="toggle toggle-primary max-w-xs"
                        />
                      </div>
                      <p className="text-xs text-base-content/60">
                        You can change your notification preferences at any time.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 mt-3 w-full max-w-sm">
                      <span className="text-lg font-semibold">Usage statistics</span>
                      <div className="divider -mt-3 -mb-1 w-full"></div>
                      <div className="text-base font-semibold flex flex-row items-center justify-between gap-3">
                        <span>Send anonymous usage data</span>
                        <input
                          type="checkbox"
                          checked={usageStatistics}
                          onChange={(e) => setUsageStatistics(e.target.checked)}
                          className="toggle toggle-primary max-w-xs"
                        />
                      </div>
                      <p className="text-xs text-base-content/60">
                        Completely anonymous. We do not capture any account or user related information when retrieving
                        usage statistics.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-sm">
                    <span className="text-lg font-semibold">Privacy</span>
                    <div className="divider -mt-3 my-0 w-full"></div>
                    <button className="btn btn-secondary btn-md btn-outline">View our Privacy Policy</button>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={getCorrespondingThemeImage('settings', theme)}
              alt="Settings"
              className="hidden xl:block absolute h-[90%] right-0 top-20"
            />
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

import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next';
import { BillBarChart } from '../components/common/BillBarChart';
import { BillDonutChart } from '../components/common/BillDonutChart';
import { Layout } from '../components/Layout';
import { sessionOptions } from '../lib/session';
import useHistoricBillsByCategory from '../lib/useHistoricBillsByCategory';
import useHistoricBillsByMonth from '../lib/useHistoricBillsByMonth';
import { User } from '../models/user/user';

export default function Historic({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { historicBillsByMonth } = useHistoricBillsByMonth(user);
  const { historicBillsByCategory } = useHistoricBillsByCategory(user);
  return (
    <Layout user={user}>
      <div className="flex flex-col items-center h-full px-12">
        <div className="h-full w-full bg-base-100 px-6">
          <div className="h-full flex flex-row relative">
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-start justify-start">
                <h2 className="card-title text-xl">
                  Historic Data
                  <div className="badge">NEW</div>
                </h2>
                <p className="text-sm">Review your historic data</p>
              </div>
              <div className="divider my-1"></div>
              <div className="grid grid-cols-2 w-full mt-2 gap-6">
                <BillBarChart historicBillsByMonth={historicBillsByMonth} />
                <BillDonutChart historicBillsByCategory={historicBillsByCategory} />
              </div>
            </div>
            <div className=""></div>
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

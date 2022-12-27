import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../../lib/httpHelpers';
import { sessionOptions } from '../../../../../lib/session';
import { Bill } from '../../../../../models/bill/bill';

export default withIronSessionApiRoute(historicHandler, sessionOptions);

async function historicHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        // Get historic bills by month
        const historicBillsByMonth = await fetchJson(getServiceUrl(`historic/months/user/${req.query.id}`), {
          method: 'GET',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
        });

        res.status(200).json(historicBillsByMonth);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

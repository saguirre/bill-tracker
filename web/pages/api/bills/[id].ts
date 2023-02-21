import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';
import { sessionOptions } from '../../../lib/session';
import { Bill } from '../../../models/bill/bill';

export default withIronSessionApiRoute(billHandler, sessionOptions);

async function billHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'DELETE':
        // Delete bill
        const deletedBill = await fetchJson(getServiceUrl(`bill/${req.query.id}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
        });

        res.status(200).json(deletedBill);
        break;
      case 'PUT':
        // Edit bill
        const updatedBill = await fetchJson(getServiceUrl(`bill/${req.query.id}`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(200).json(updatedBill as Bill);
        break;
      default:
        res.setHeader('Allow', ['DELETE', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

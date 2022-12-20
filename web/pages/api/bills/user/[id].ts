import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';

import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { Bill } from '../../../../models/bill/bill';

export default withIronSessionApiRoute(userBillHandler, sessionOptions);

async function userBillHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'GET':
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }

        try {
          const bills = await fetchJson(getServiceUrl(`bill/user/${req.query.id}`), {
            method: 'GET',
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
          });

          res.json(bills as Bill[]);
        } catch (error) {
          res.status(200).json([]);
        }
        break;
      case 'POST':
        // Create new Bill
        const newBill = await fetchJson(getServiceUrl(`bill/user/${req.query.id}`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(201).json(newBill as Bill);

        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

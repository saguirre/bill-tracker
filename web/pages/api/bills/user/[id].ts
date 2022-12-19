import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';

import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { Bill } from '../../../../models/bill/bill';

export default withIronSessionApiRoute(eventsRoute, sessionOptions);

async function eventsRoute(req: NextApiRequest, res: NextApiResponse<Bill[]>) {
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
}

import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';

import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { Notification } from '../../../../models/notification/notification';

export default withIronSessionApiRoute(userNotificationHandler, sessionOptions);

async function userNotificationHandler(req: NextApiRequest, res: NextApiResponse) {
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
          const notifications = await fetchJson(getServiceUrl(`notification/user/${req.query.id}`), {
            method: 'GET',
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
          });

          res.json(notifications as Notification[]);
        } catch (error) {
          res.status(200).json([]);
        }
        break;
      case 'POST':
        // Create new Notification
        const newNotification: any = await fetchJson(getServiceUrl(`notification/user/${req.query.id}`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(201).json(newNotification as Notification);

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

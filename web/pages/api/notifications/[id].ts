import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';

import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';
import { Notification } from '../../../models/notification/notification';

export default withIronSessionApiRoute(notificationHandler, sessionOptions);

async function notificationHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'PUT':
        // Mark Notification as read
        const modifiedNotification: any = await fetchJson(getServiceUrl(`notification/${req.query.id}`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body || { read: true }),
        });

        res.status(201).json(modifiedNotification as Notification);

        break;
      case 'DELETE':
        // Delete Notification
        const deletedNotification: any = await fetchJson(getServiceUrl(`notification/${req.query.id}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
        });

        res.status(201).json(deletedNotification as Notification);

        break;
      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

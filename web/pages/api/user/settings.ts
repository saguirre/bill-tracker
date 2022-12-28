import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';
import { sessionOptions } from '../../../lib/session';
import { User } from '../../../models/user/user';

export default withIronSessionApiRoute(billHandler, sessionOptions);

async function billHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'PUT':
        // Edit user settings
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }

        const updatedUser: User = await fetchJson(getServiceUrl(`user/settings/${user.id}`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        req.session.user = { ...updatedUser, isLoggedIn: true };
        await req.session.save();
        res.status(200).json(updatedUser as User);
        break;
      default:
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

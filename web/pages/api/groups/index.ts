import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';
import { sessionOptions } from '../../../lib/session';
import { Group } from '../../../models/group/group';
import { User } from '../../../models/user/user';

export default withIronSessionApiRoute(groupHandler, sessionOptions);

async function groupHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'POST':
        // Add group
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }

        const addedGroup: Group = await fetchJson(getServiceUrl(`group`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(200).json(addedGroup as User);
        break;
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { sessionOptions } from '../../../../lib/session';
import { Group } from '../../../../models/group/group';
import { User } from '../../../../models/user/user';

export default withIronSessionApiRoute(userGroupHandler, sessionOptions);

async function userGroupHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        // Get user groups
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }

        const userGroups: Group[] = await fetchJson(getServiceUrl(`group/user/${req.query.id}`), {
          method: 'GET',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
        });

        res.status(200).json(userGroups as User);
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

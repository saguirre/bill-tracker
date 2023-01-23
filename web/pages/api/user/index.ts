import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models/user/user';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'GET':
        if (req.session.user) {
          try {
            res.json({
              ...req.session.user,
              isLoggedIn: true,
            });
          } catch (error) {
            console.error(error);
            res.status(500);
          }
        } else {
          res.json({
            isLoggedIn: false,
          });
        }
        break;
      case 'PUT':
        // Edit user profile
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }

        const updatedUser: User = await fetchJson(getServiceUrl(`user/profile/${user.id}`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        req.session.user = { ...updatedUser, isLoggedIn: true };
        await req.session.save();
        res.status(200).json(updatedUser as User);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

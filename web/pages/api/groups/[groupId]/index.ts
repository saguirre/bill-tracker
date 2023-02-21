import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { sessionOptions } from '../../../../lib/session';

export default withIronSessionApiRoute(individualGroupHandler, sessionOptions);

async function individualGroupHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query, method } = req;
    const user = req.session.user;

    if (!user || user.isLoggedIn === false) {
      res.status(401).end();
      return;
    }
    switch (method) {
      case 'DELETE':
        // Delete group
        await fetchJson(getServiceUrl(`group/${query.groupId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${req.session.accessToken}` },
        });

        res.status(200).json({ success: true });
        break;

      default:
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

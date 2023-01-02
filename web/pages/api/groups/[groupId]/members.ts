import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { sessionOptions } from '../../../../lib/session';

export default withIronSessionApiRoute(individualGroupHandler, sessionOptions);

async function individualGroupHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query, body, method } = req;

    switch (method) {
      case 'POST':
        // Add members
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }
        await fetchJson(getServiceUrl(`group/${query.groupId}/members`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(201).json({ success: true });
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

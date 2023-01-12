import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { sessionOptions } from '../../../../lib/session';

export default withIronSessionApiRoute(groupMembersHandler, sessionOptions);

async function groupMembersHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query, body, method } = req;
    const user = req.session.user;

    if (!user || user.isLoggedIn === false) {
      res.status(401).end();
      return;
    }
    switch (method) {
      case 'POST':
        // Add members
        await fetchJson(getServiceUrl(`group/${query.groupId}/members`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(201).json({ success: true });
        break;
      case 'PUT':
        // Accept invitation
        const updatedGroup = await fetchJson(getServiceUrl(`group/${query.groupId}/members`), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(200).json(updatedGroup);
        break;
      default:
        res.setHeader('Allow', ['POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

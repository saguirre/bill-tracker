import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../lib/fetchJson';
import { getServiceUrl } from '../../../lib/httpHelpers';
import { User } from '../../../models/user/user';

export default async function resetPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'POST':
        const updatedUser: User = await fetchJson(getServiceUrl('user/reset-password'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(200).json({ success: true });
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

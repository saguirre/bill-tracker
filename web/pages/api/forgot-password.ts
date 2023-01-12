import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../lib/fetchJson';
import { getServiceUrl } from '../../lib/httpHelpers';

export default async function forgotPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'POST':
        // Send recover password email
        await fetchJson(getServiceUrl(`user/forgot-password`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(200);
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

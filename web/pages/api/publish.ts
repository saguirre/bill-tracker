import type { NextApiRequest, NextApiResponse } from 'next';

import * as dotenv from 'dotenv';
import * as Ably from 'ably/promises';
import fetchJson from '../../lib/fetchJson';
import { getServiceUrl } from '../../lib/httpHelpers';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.ABLY_API_KEY) {
    return res
      .status(500)
      .setHeader('content-type', 'application/json')
      .json({
        errorMessage: `Missing ABLY_API_KEY environment variable.
                If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
                If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
                Please see README.md for more details on configuring your Ably API Key.`,
      });
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY);

  var channel = client.channels.get('status-updates');
  const body = req.body;

  await channel.publish('update-from-server', body);
  return res.status(200);
}

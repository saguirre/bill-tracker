// pages/api/chatgpt.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ask } from '../../lib/chatgpt';
import { sessionOptions } from '../../lib/session';

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const prompt = req.body;
    console.log(prompt);
    try {
      const response = await ask(prompt);
      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error calling ChatGPT API:');
      res.status(500).json({ error: 'Error calling ChatGPT API' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

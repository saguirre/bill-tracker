import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user/user';
import axios from 'axios';
import { getServiceUrl } from '../../lib/httpHelpers';

export default withIronSessionApiRoute(signUpRoute, sessionOptions);

async function signUpRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const axiosResponse = await axios.post(getServiceUrl('auth/signup'), req.body);
    const {
      data: { token, ...userData },
    } = axiosResponse;

    const user = { isLoggedIn: true, ...userData } as User;
    req.session.user = user;
    req.session.accessToken = token;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

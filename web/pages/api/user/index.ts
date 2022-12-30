import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models/user/user';

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
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
}

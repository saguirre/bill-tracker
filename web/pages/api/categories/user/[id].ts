import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';

import { NextApiRequest, NextApiResponse } from 'next';
import fetchJson from '../../../../lib/fetchJson';
import { getServiceUrl } from '../../../../lib/httpHelpers';
import { CategoryModel } from '../../../../models/category';

export default withIronSessionApiRoute(userCategoryHandler, sessionOptions);

async function userCategoryHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, method } = req;

    switch (method) {
      case 'GET':
        const user = req.session.user;

        if (!user || user.isLoggedIn === false) {
          res.status(401).end();
          return;
        }

        try {
          const categories = await fetchJson(getServiceUrl(`category/user/${req.query.id}`), {
            method: 'GET',
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
          });

          res.json(categories as CategoryModel[]);
        } catch (error) {
          res.status(200).json([]);
        }
        break;
      case 'POST':
        // Create new Category
        const newCategory: any = await fetchJson(getServiceUrl(`category/user/${req.query.id}`), {
          method: 'POST',
          headers: { Authorization: `Bearer ${req.session.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        res.status(201).json(newCategory as CategoryModel);

        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = (
  _req: NextApiRequest,
  res: NextApiResponse
) => {
  res.status(200).json({ name: 'John Doe' });
};

export default handler;

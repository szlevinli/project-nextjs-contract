import { Company } from '../../lib/sqlite/models';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const income = req.body;
  const record = await Company.create(income);
  res.status(200).json(record);
};

export default handler;

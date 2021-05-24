import { Company } from '../../lib/sqlite/models';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (_, res) => {
  const companies = await Company.findAll();
  res.status(200).json(companies.map((v) => JSON.stringify(v)));
};

export default handler;

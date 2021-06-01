import { Company, CompanyFields } from '../../lib/sqlite/models';
import { NextApiHandler } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler: NextApiHandler = async (req, res) => {
  const income = req.body;
  const record = (await Company.create(income)).toJSON() as CompanyFields;
  res.status(200).json(record);
};

export default withApiAuthRequired(handler);

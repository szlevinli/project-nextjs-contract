import { NextApiHandler } from 'next';
import { inspect } from 'util';
import { Company, CompanyFields } from '../../lib/sqlite/models';

const handler: NextApiHandler = async (_, res) => {
  const companies = (await Company.findAll()).map(
    (v) => v.toJSON() as CompanyFields
  );

  res.status(200).json(companies);
};

export default handler;

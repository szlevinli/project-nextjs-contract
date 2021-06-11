import { NextApiHandler } from 'next';
import { Company, CompanyAllFields } from '../../lib/sqlite/models';

const handler: NextApiHandler = async (_, res) => {
  const companies = (await Company.findAll()).map(
    (v) => v.toJSON() as CompanyAllFields
  );

  res.status(200).json(companies);
};

export default handler;

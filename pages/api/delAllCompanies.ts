import { Company } from '../../lib/sqlite/models';
import { NextApiHandler } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

const handler: NextApiHandler = async (req, res) => {
  const { user } = getSession(req, res);
  console.log(`[API:delAllCompanies]: user=${JSON.stringify(user)}`);
  const deletedNum = await Company.destroy({ truncate: true });
  res.status(200).json({ deleted_number: deletedNum });
};

export default withApiAuthRequired(handler);

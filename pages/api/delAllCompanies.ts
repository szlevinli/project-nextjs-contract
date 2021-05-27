import { Company } from '../../lib/sqlite/models';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (_, res) => {
  const deletedNum = await Company.destroy({ truncate: true });
  res.status(200).json({ deleted_number: deletedNum });
};

export default handler;

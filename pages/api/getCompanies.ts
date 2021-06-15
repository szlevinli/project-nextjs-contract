import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { pipe } from 'fp-ts/function';
import { tryCatch, fold } from 'fp-ts/TaskEither';
import { NextApiHandler } from 'next';
import { Company, CompanyAllFields } from '../../lib/sqlite/models';

const queryCompany = () =>
  tryCatch(
    () => Company.findAll(),
    (reason) => new Error(String(reason))
  );

const queryCompanyHandler: NextApiHandler = async (_, res) => {
  await pipe(
    queryCompany(),
    fold(
      (e) => async () => res.status(290).json(String(e)),
      (d) => async () =>
        res.status(200).json(d.map((v) => v.toJSON() as CompanyAllFields))
    )
  )();
};

export default withApiAuthRequired(queryCompanyHandler);

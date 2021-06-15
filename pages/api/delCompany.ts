import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join } from 'ramda';
import { Company, PkFields } from '../../lib/sqlite/models';
import { DeleteCompanyValidator } from '../../lib/validations/validator';

const deleteCompany = ({ id }: PkFields) =>
  TE.tryCatch(
    () =>
      Company.destroy({
        where: {
          id,
        },
      }),
    (reason) => new Error(String(reason))
  );

const deleteCompanyHandler: NextApiHandler = async (req, res) => {
  await pipe(
    DeleteCompanyValidator.decode(req.body),
    E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),
    TE.fromEither,
    TE.chain((d) => deleteCompany(d)),
    TE.fold(
      (e) => async () => res.status(290).json(String(e)),
      (d) => async () => res.status(200).json(d)
    )
  )();
};

export default withApiAuthRequired(deleteCompanyHandler);

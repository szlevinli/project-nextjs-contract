import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Validation } from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join } from 'ramda';
import {
  Company,
  CompanyDeleteFields,
  PkFields,
} from '../../lib/sqlite/models';
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
  const typeValidatedResult: Validation<CompanyDeleteFields> =
    DeleteCompanyValidator.decode(req.body);

  const task = pipe(
    typeValidatedResult,
    E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),
    TE.fromEither,
    TE.chain((d) => deleteCompany(d))
  );

  const result = await task();

  pipe(
    result,
    E.fold(
      (e) => res.status(290).json(String(e)),
      (d) => res.status(200).json(d)
    )
  );
};

export default withApiAuthRequired(deleteCompanyHandler);
